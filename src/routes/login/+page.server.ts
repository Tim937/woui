import { fail, redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/server/db/auth-service';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    try {
      const result = await loginUser({ email, password });

      cookies.set('session', result.user.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      return fail(401, { email: email ?? '', message });
    }

    redirect(303, '/dashboard');
  }
};
