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

export const newClientSchema = z.object({
  email:z.string().email(),
  message: z.string().optional()
});


export const taskSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(), // date en string depuis le form
});