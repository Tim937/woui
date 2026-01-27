import { unlinkSync, existsSync, rmSync } from 'fs';
import { execSync, spawn } from 'child_process';

// 1. Arrêter le serveur dev (port 5173)
try {
  const result = execSync('netstat -ano | findstr :5173', { encoding: 'utf8' });
  const pid = result.split(/\s+/).filter(Boolean).pop();
  if (pid) {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    console.log('✓ Serveur dev arrêté');
  }
} catch {
  console.log('○ Aucun serveur dev actif');
}

// 2. Supprimer la DB et le dossier migrations
if (existsSync('local.db')) {
  unlinkSync('local.db');
  console.log('✓ Base supprimée');
}
if (existsSync('drizzle')) {
  rmSync('drizzle', { recursive: true });
  console.log('✓ Dossier migrations supprimé');
}

// 3. Générer migrations
execSync('npx drizzle-kit generate', { stdio: 'inherit' });
console.log('✓ Migrations générées');

// 4. Migrer
execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
console.log('✓ Migrations appliquées');

// 5. Démarrer le serveur dev en arrière-plan
console.log('\n→ Démarrage du serveur dev...');
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

// 6. Attendre que le serveur soit prêt puis appeler /api/seed
const waitForServer = async () => {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch('http://localhost:5173');
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
};

const ready = await waitForServer();
if (!ready) {
  console.error('✗ Serveur non disponible');
  process.exit(1);
}

console.log('✓ Serveur prêt');

// 7. Seed via endpoint
const res = await fetch('http://localhost:5173/api/seed');
const data = await res.json();

if (data.success) {
  console.log('✓ Seed terminé');
  console.log('\nAdmin :');
  console.log('  Email:', data.admin.email);
  console.log('  Password:', data.admin.password);
  console.log('\nAgence :');
  console.log('  Email:', data.agency.email);
  console.log('  Password:', data.agency.password);
} else {
  console.error('✗ Seed échoué:', data.message);
}

// Tuer le serveur temporaire et relancer avec output visible
server.kill();
console.log('\n→ Relance du serveur dev...\n');
spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});
