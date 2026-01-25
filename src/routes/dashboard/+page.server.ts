import {redirect} from '@sveltejs/kit';
import {db} from '$lib/server/db';
import {users} from '$lib/server/db/schemas';
import {eq} from 'drizzle-orm';
import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async({cookies}) => {

    const sessionId = cookies.get('session');
    if(!sessionId) throw redirect(302,'/login');

    const user = db.select().from(users).where(eq(users.id,sessionId)).get();
    if(!user) throw redirect(302,'/login');
    const {password:_,...safeUser} = user;
    return {user:safeUser};
};



