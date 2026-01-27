import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('session');

  // Routes /admin/* → admin uniquement
  if (event.url.pathname.startsWith('/admin')) {
    if (!sessionId) throw redirect(302, '/login');

    const user = db.select().from(users).where(eq(users.id, sessionId)).get();
    if (!user || user.role !== 'admin') throw redirect(302, '/login');

    event.locals.user = user;
  }

  return resolve(event);
};