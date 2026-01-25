import { z } from 'zod';

// --- VALIDATION UTILISATEUR ---
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// --- VALIDATION PROFIL CLIENT ---
export const createClientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Schéma combiné pour le formulaire d'inscription complet
export const fullRegistrationSchema = z.object({
  user: registerUserSchema,
  client: createClientSchema,
});

// --- VALIDATION LOGIN ---
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
