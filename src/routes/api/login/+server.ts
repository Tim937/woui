import { json, type RequestEvent } from '@sveltejs/kit';
import { loginUser } from '$lib/server/db/auth-service';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const body = await request.json();
    const result = await loginUser(body);

    // Créer un cookie de session simple
    cookies.set('session', result.user.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1 // 1 jours
    });

    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return json({ success: false, message }, { status: 401 });
  }
};
