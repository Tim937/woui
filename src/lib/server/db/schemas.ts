import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Note: Nécessaire si tu utilises Node.js < 19 ou certains environnements
import crypto from 'crypto'; 


// --- 1. TABLE AGENCE ---

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'agency'] }).default('agency').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});


// --- 2. TABLE CLIENTS ---
export const clients = sqliteTable('clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  accessToken: text('access_token')
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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

// --- 3. TABLE AGENCY_CLIENTS (liaison many-to-many) ---
export const agencyClients = sqliteTable('agency_clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  agencyId: text('agency_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  clientId: text('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// --- 4. TABLE TRIPS ---
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

// --- 4. TABLE CONVERSATIONS ---
export const conversations = sqliteTable('conversations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
    .notNull(),
  agencyId: text('agency_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  tripId: text('trip_id')
    .references(() => trips.id, { onDelete: 'set null' }), // optionnel
  type: text('type', { enum: ['trip', 'general', 'support'] })
    .default('general')
    .notNull(),
  subject: text('subject').notNull(),
  status: text('status', { enum: ['open', 'closed'] })
    .default('open')
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- 5. TABLE MESSAGES ---
export const messages = sqliteTable('messages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: text('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  sender: text('sender', { enum: ['agency', 'client'] }).notNull(),
  content: text('content').notNull(),
  read: integer('read', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// --- 6. TABLE MAPS (cartes de base) ---
export const maps = sqliteTable('maps', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  agencyId: text('agency_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  markers: text('markers'), // JSON: [{lat, lng, title, description}]
  routes: text('routes'), // JSON: [{points: [{lat, lng}], color}]
  centerLat: text('center_lat'),
  centerLng: text('center_lng'),
  zoom: integer('zoom').default(10),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- 7. TABLE TRIP_MAPS (cartes customisées par trip) ---
export const tripMaps = sqliteTable('trip_maps', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tripId: text('trip_id')
    .references(() => trips.id, { onDelete: 'cascade' })
    .notNull(),
  mapId: text('map_id')
    .references(() => maps.id, { onDelete: 'cascade' })
    .notNull(),
  customMarkers: text('custom_markers'), // JSON: marqueurs ajoutés/modifiés
  customRoutes: text('custom_routes'), // JSON: routes ajoutées/modifiées
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// --- 8. RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  agencyClients: many(agencyClients),
  maps: many(maps),
  conversations: many(conversations),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  agencyClients: many(agencyClients),
  trips: many(trips),
  conversations: many(conversations),
}));

export const agencyClientsRelations = relations(agencyClients, ({ one }) => ({
  agency: one(users, {
    fields: [agencyClients.agencyId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [agencyClients.clientId],
    references: [clients.id],
  }),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  client: one(clients, {
    fields: [trips.clientId],
    references: [clients.id],
  }),
  conversations: many(conversations),
  tripMaps: many(tripMaps),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  client: one(clients, {
    fields: [conversations.clientId],
    references: [clients.id],
  }),
  agency: one(users, {
    fields: [conversations.agencyId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [conversations.tripId],
    references: [trips.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const mapsRelations = relations(maps, ({ one, many }) => ({
  agency: one(users, {
    fields: [maps.agencyId],
    references: [users.id],
  }),
  tripMaps: many(tripMaps),
}));

export const tripMapsRelations = relations(tripMaps, ({ one }) => ({
  trip: one(trips, {
    fields: [tripMaps.tripId],
    references: [trips.id],
  }),
  map: one(maps, {
    fields: [tripMaps.mapId],
    references: [maps.id],
  }),
}));