import { z } from 'zod';

// --- LOGIN AGENCE ---
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// --- LOGIN CLIENT (accessToken + password) ---
export const clientLoginSchema = z.object({
  accessToken: z.string().uuid(),
  password: z.string().min(1),
});

// --- CRÉATION CLIENT (par agence) ---
export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  address: z.string().optional(),
});
