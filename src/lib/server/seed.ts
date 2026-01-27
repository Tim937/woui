import { db } from '$lib/server/db';
import { users, clients, agencyClients } from '$lib/server/db/schemas';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 0. Créer l'admin
  const admin = db.insert(users).values({
    name: "Admin",
    email: 'admin@ouiiiz.re',
    password: hashedPassword,
    role: 'admin',
  }).returning().get();

  // 1. Créer une agence
  const agency = db.insert(users).values({
    name: "Nou Lé La",
    email: 'agencetim@lareunion1234.com',
    password: hashedPassword,
    role: 'agency',
  }).returning().get();

  const familyNames = ['Hoareau', 'Payet', 'Grondin', 'Poudroux', 'Boyer', 'Fontaine', 'Maillot', 'Dijoux', 'Riviere', 'Techer'];
  const firstNames = ['Tim', 'Sophie', 'Johanna', 'Roland', 'Jean', 'Jacques', 'Manu', 'Solange', 'Michelle', 'Flavien', 'Romain', 'Thomas', 'Camille', 'Jo', 'Patrice'];

  // 2. Générer les clients (combinaisons uniques prénom + nom)
  const usedCombinations = new Set<string>();

  const getUniqueClient = (familyName: string) => {
    let firstName: string;
    let fullName: string;

    do {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      fullName = `${firstName} ${familyName}`;
    } while (usedCombinations.has(fullName));

    usedCombinations.add(fullName);

    return {
      name: fullName,
      email: `${familyName.toLowerCase()}.${firstName.toLowerCase()}@wouitest.lareunion`,
      phone: '00000000',
      address: 'rue fictive',
    };
  };

  const clientsData = familyNames.map(getUniqueClient);

  const createdClients = [];
  for (const c of clientsData) {
    const client = db.insert(clients).values({
      email: c.email,
      password: hashedPassword,
      name: c.name,
      phone: c.phone,
      address: c.address,
    }).returning().get();
    createdClients.push(client);

    // 3. Lier le client à l'agence
    db.insert(agencyClients).values({
      agencyId: agency.id,
      clientId: client.id
    }).run();
  }

  return {
    admin: { email: admin.email, password: 'password123' },
    agency: { email: agency.email, password: 'password123' },
    clients: createdClients.map(c => ({
      name: c.name,
      email: c.email,
      accessToken: c.accessToken,
      link: `/client/access/${c.accessToken}`
    }))
  };
}
