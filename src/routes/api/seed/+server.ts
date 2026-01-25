import { json, type RequestEvent } from '@sveltejs/kit';
import { registerNewClient } from '$lib/server/db/auth-service';

// Route temporaire pour créer un user de test
// À SUPPRIMER après usage
export async function GET({ url }: RequestEvent) {
  try {
    await registerNewClient({
      user: {
        email: 'timpxsocial@gmail.com',
        password: 'password123'
      },
      client: {
        name: 'Test',
        phone: '0778379400',
        address: '123 Rue Test'
      }
    });

    return json({ success: true, message: 'User créé: timpxsocial@gmail.com/ password123' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur';
    return json({ success: false, message }, { status: 400 });
  }
}
