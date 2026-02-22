
import { db } from '$lib/server/db';
import { clients } from '$lib/server/db/schemas';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';


export const load : PageServerLoad = async ({params}) => {
    const client = await db.query.clients.findFirst({
        where: eq(clients.id, params.id),
        with: {trips:true}
    })

    if(client) {
        return {client};
    } else {
        error(404, 'Client introuvable');
    }

}