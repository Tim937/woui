import { db } from '.'; // Ta connexion database
import { users, clients } from './schemas';
import { fullRegistrationSchema, loginSchema } from './validation';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function registerNewClient(input: unknown) {
  // 1. VALIDATION ZOD
  // Si l'input n'est pas bon, ça lance une erreur automatiquement
  const data = fullRegistrationSchema.parse(input);

  // 2. VÉRIFIER SI L'EMAIL EXISTE DÉJÀ
  const existingUser = await db.select().from(users).where(eq(users.email, data.user.email)).get();
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  // 3. HACHAGE DU MOT DE PASSE (BCRYPT)
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(data.user.password, saltRounds);

  // 4. INSERTION EN TRANSACTION (Drizzle + better-sqlite3 = synchrone)
  db.transaction((tx) => {
    // A. Créer le User avec le mot de passe haché
    const newUser = tx.insert(users).values({
      email: data.user.email,
      password: hashedPassword,
      role: 'client',
    }).returning().get();

    // B. Créer le profil Client lié
    tx.insert(clients).values({
      userId: newUser.id,
      name: data.client.name,
      phone: data.client.phone,
      address: data.client.address,
    }).run();
  });

  return { success: true, message: "Client créé avec succès" };
}

export async function loginUser(input: unknown) {
  // 1. VALIDATION ZOD
  const data = loginSchema.parse(input);
  // 2. CHERCHER L'USER PAR EMAIL
  const user = await db.select().from(users).where(eq(users.email, data.email)).get();
  // 3. VÉRIFIER SI L'USER EXISTE
  // Message générique pour ne pas révéler si l'email existe
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // 4. COMPARER LE PASSWORD AVEC LE HASH
  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // 5. RETOURNER L'USER (sans le password)
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}