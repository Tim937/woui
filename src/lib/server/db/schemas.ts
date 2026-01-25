import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Note: Nécessaire si tu utilises Node.js < 19 ou certains environnements
import crypto from 'crypto'; 

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'client'] }).default('client').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});


// --- 2. TABLE CLIENTS ---
export const clients = sqliteTable('clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' }) // Cascade supporté si activé dans SQLite
    .notNull()
    .unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- 3. TABLE TRIPS ---
export const trips = sqliteTable('trips', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
    .notNull(),
  reference: text('reference').notNull().unique(),
  destination: text('destination').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['active', 'completed', 'cancelled'] })
    .default('active')
    .notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- 4. TABLE MESSAGES ---
export const messages = sqliteTable('messages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tripId: text('trip_id')
    .references(() => trips.id, { onDelete: 'cascade' })
    .notNull(),
  sender: text('sender', { enum: ['agency', 'client'] }).notNull(),
  content: text('content').notNull(),
  subject: text('subject'),
  read: integer('read', { mode: 'boolean' }).default(false).notNull(), // 0 ou 1 converti en booléen
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// --- 5. RELATIONS (Identique à PostgreSQL) ---

export const usersRelations = relations(users, ({ one }) => ({
  clientProfile: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  client: one(clients, {
    fields: [trips.clientId],
    references: [clients.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  trip: one(trips, {
    fields: [messages.tripId],
    references: [trips.id],
  }),
}));