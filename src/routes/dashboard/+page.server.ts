import {redirect, fail} from '@sveltejs/kit';

import {db} from '$lib/server/db';
import {users,clients, agencyClients} from '$lib/server/db/schemas';
import {eq} from 'drizzle-orm';
import type {PageServerLoad} from './$types';
import {newClientSchema} from '$lib/server/db/validation';
import { sendInviteEmail } from '$lib/server/mail';
import { getSessionSafeUser } from '$lib/server/sessions';


// les schémas de validations zod

export const load: PageServerLoad = async({cookies}) => {


  const { user } = getSessionSafeUser(cookies);

  // récupérer les clients de l'agence via la table de liaison
  const agencyClientsList = db
  .select({
      id:clients.id,
      name:clients.name,
      email:clients.email,
      phote: clients.phone,
      address:clients.accessToken,
      createdAt:clients.createdAt
  })
  .from(agencyClients)
  .innerJoin(clients, eq(agencyClients.clientId, clients.id))
  .where(eq(agencyClients.agencyId, user.id))
  .all();
  return {user, clients: agencyClientsList}
};


export const actions = {

  default: async ({ request, cookies, url }) => {

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
        name:'',
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
};

