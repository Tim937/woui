import { db } from '.';
import { users, clients } from './schemas';
import { loginSchema } from './validation';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

// Login agence (table users)
export async function loginUser(input: unknown) {
  const data = loginSchema.parse(input);

  const user = db.select().from(users).where(eq(users.email, data.email)).get();
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Login client via accessToken + password
export async function loginClient(accessToken: string, password: string) {
  const client = db.select().from(clients).where(eq(clients.accessToken, accessToken)).get();
  if (!client) {
    throw new Error("Lien invalide");
  }

  const passwordMatch = await bcrypt.compare(password, client.password);
  if (!passwordMatch) {
    throw new Error("Mot de passe incorrect");
  }

  const { password: _, ...clientWithoutPassword } = client;
  return { success: true, client: clientWithoutPassword };
}