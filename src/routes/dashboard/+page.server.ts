import {redirect, fail} from '@sveltejs/kit';

import {db} from '$lib/server/db';
import { clients, agencyClients, dashboardSlots } from '$lib/server/db/schemas';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { newClientSchema } from '$lib/server/db/validation';
import { sendInviteEmail } from '$lib/server/mail';
import { getSessionSafeUser } from '$lib/server/sessions';


// les schémas de validations zod

export const load: PageServerLoad = async({cookies}) => {


  const { user } = getSessionSafeUser(cookies);

  // Vérifier que l'utilisateur a le bon rôle
  if (user.role !== 'admin' && user.role !== 'agency') {
    throw redirect(303, '/'); // ou une page d'erreur
  }

  let agencyClientsList;

  // récupérer les clients de l'agence via la table de liaison

  try {
    if(user.role === "admin") {
      agencyClientsList = await db.query.clients.findMany({
        with: {
          trips: {
            columns: {
              id: true,
              reference: true,
              destination: true,
              status: true
            }
          }
        }
      });
    } else {
      const result = await db.query.agencyClients.findMany({
        where: eq(agencyClients.agencyId, user.id),
        with: {
          client: {
            with: {
              trips: {
                columns: {
                  id: true,
                  reference: true,
                  destination: true,
                  status: true
                }
              }
            }
          }
        }
      });
      agencyClientsList = result.map(r => r.client);
    }
  } catch (error) {
    console.error('Erreur Query API:', error);
    throw error;
  }

  let slots = await db.select().from(dashboardSlots).orderBy(dashboardSlots.position);

  return {user, clients: agencyClientsList, slots}
};


export const actions = {

  inviteClient: async ({ request, cookies, url }) => {

    const { user } = getSessionSafeUser(cookies);

    const formData = await request.formData()

    const newClientContent = {
      email:formData.get('newClient'),
      message:formData.get('newClientMessage')
    }

    const subjectToDefineLaterByUser = `Votre lien pour accéder à votre espace : ${user.name}`

    const result = newClientSchema.safeParse(newClientContent);

    if (!result.success) {
      return result.error; 
    } 
  
    const existingClient = db.select().from(clients).where(eq(clients.email, result.data.email)).get();
    let clientData;

    if(existingClient){
      clientData = existingClient;
    } else {
      clientData = db.insert(clients).values({
        email:result.data.email,
        name:'Avez-vous un nom ?',
        surname:'Ho, et un prénom aussi ?',
        password:''
      }).returning().get();
        db.insert(agencyClients).values({
        agencyId: user.id,
        clientId:clientData.id
      }).run();
    }

    const link = `${url.origin}/client/access/${clientData.accessToken}`;
    await sendInviteEmail(result.data.email, link, subjectToDefineLaterByUser,result.data.message);

    // Process the form data and perform actions
    return { 
      success: true,
      message:result.data.message,
      email:result.data.email,
      link

    };
  },
  defaultSlot: async ({ cookies }) => {
    getSessionSafeUser(cookies);
    await db.delete(dashboardSlots);
    await db.insert(dashboardSlots).values([
      { position: 0 },
      { position: 1 },
      { position: 2 },
      { position: 3 },
    ]);
    return { success: true };
  },
  addSlot: async ({ cookies }) => {
    getSessionSafeUser(cookies);
    // Tous les slots existants reculent d'une place
    await db.update(dashboardSlots).set({ position: sql`position + 1` });
    // Le nouveau arrive en position 0
    await db.insert(dashboardSlots).values({ position: 0 });
    return { success: true };
  },
  updateSlotType: async ({ request, cookies }) => {
    getSessionSafeUser(cookies);
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const type = formData.get('type') as 'clients' | 'stats' | 'chats' | 'meets' | null;
    await db.update(dashboardSlots).set({ type: type || null }).where(eq(dashboardSlots.id, id));
    return { success: true };
  },
  removeSlot: async ({ request, cookies }) => {
    getSessionSafeUser(cookies);
    const formData = await request.formData();
    const id = formData.get('id') as string;
    // Récupérer la position du slot à supprimer
    const [slot] = await db.select().from(dashboardSlots).where(eq(dashboardSlots.id, id));
    await db.delete(dashboardSlots).where(eq(dashboardSlots.id, id));
    // Les slots suivants remontent d'une place
    await db.update(dashboardSlots)
      .set({ position: sql`position - 1` })
      .where(sql`position > ${slot.position}`);
    return { success: true };
  },
};

