import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';



//Pour récupérer un utilisateur sans le mot de passe associé



export function getSessionSafeUser(cookies: Cookies) {

  const sessionId = cookies.get('session');
  if (!sessionId) throw redirect(302, '/login');

  const user = db.select().from(users).where(eq(users.id, sessionId)).get();

  if (!user) throw redirect(302, '/login');
  return { sessionId, user };
}


export function getSessionUser(cookies: Cookies) {
  const sessionId = cookies.get('session');
  if (!sessionId) throw redirect(302, '/login');

  const user = db.select().from(users).where(eq(users.id, sessionId)).get();
  if (!user) throw redirect(302, '/login');

  const { password: _, ...safeUser } = user;
  return { sessionId, user: safeUser };
}

