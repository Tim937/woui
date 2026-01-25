import {redirect} from '@sveltejs/kit';
import {db} from '$lib/server/db';
import {users,clients, agencyClients} from '$lib/server/db/schemas';
import {eq} from 'drizzle-orm';
import type {PageServerLoad} from './$types';

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



