import {redirect, fail} from '@sveltejs/kit';

import {db} from '$lib/server/db';
import {users,clients, agencyClients} from '$lib/server/db/schemas';
import {eq} from 'drizzle-orm';
import type {PageServerLoad} from './$types';
import {newClientSchema} from '$lib/server/db/validation';

// les schémas de validations zod

export const load: PageServerLoad = async({cookies}) => {

    const sessionId = cookies.get('session');
    if(!sessionId) throw redirect(302,'/login');

    const user = db.select().from(users).where(eq(users.id,sessionId)).get();
    
    if(!user) throw redirect(302,'/login');
    const {password:_,...safeUser} = user;
   
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

    return {user: safeUser, clients: agencyClientsList}
};


export const actions = {

  default: async ({ request, cookies, url }) => {
    const sessionId = cookies.get('session');
    const formData = await request.formData()

    const newClientContent = {
      email:formData.get('newClient'),
      message:formData.get('newClientMessage')
    }

    const result = newClientSchema.safeParse(newClientContent);

    if (!result.success) {
      return result.error; 
    } 
   
   
    const createClient = db.insert(clients).values({
      email:result.data.email,
      name:'',
      password:''
    }).returning().get()
    
    
    // const link = db.select().from(users).where(eq(users.id,sessionId)).get();

    // Process the form data and perform actions
    return { 
      success: true,
      message:result.data.message,
      email:result.data.email,
      link: `${url.origin}/client/access/${createClient.accessToken}`

    };
  },
};

