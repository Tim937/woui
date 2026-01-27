import { json } from '@sveltejs/kit';
import { seedDatabase } from '$lib/server/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return json({ success: true, message: 'Données créées', ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur';
    return json({ success: false, message }, { status: 400 });
  }
}
