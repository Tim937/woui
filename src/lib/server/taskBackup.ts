import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const BACKUP_PATH = resolve(process.cwd(), '..', 'taskBackup.json');

interface TaskBackupEntry {
	id: string;
	title: string;
	description: string | null;
	category: string | null;
	priority: string;
	status: string;
	dueDate: string | null;
	createdAt: string;
	backedUpAt: string;
}

function readBackup(): TaskBackupEntry[] {
	if (!existsSync(BACKUP_PATH)) return [];
	const raw = readFileSync(BACKUP_PATH, 'utf-8');
	return JSON.parse(raw);
}

function writeBackup(entries: TaskBackupEntry[]): void {
	writeFileSync(BACKUP_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

/** Ajoute une tâche au backup (append-only, aucune modification/suppression possible) */
export function appendTaskBackup(task: {
	id: string;
	title: string;
	description?: string | null;
	category?: string | null;
	priority: string;
	status: string;
	dueDate?: Date | null;
	createdAt?: Date;
}): void {
	const entries = readBackup();
	entries.push({
		id: task.id,
		title: task.title,
		description: task.description ?? null,
		category: task.category ?? null,
		priority: task.priority,
		status: task.status,
		dueDate: task.dueDate?.toISOString() ?? null,
		createdAt: task.createdAt?.toISOString() ?? new Date().toISOString(),
		backedUpAt: new Date().toISOString(),
	});
	writeBackup(entries);
}

/** Initialise le backup avec les tâches existantes (idempotent — ne fait rien si le fichier existe déjà) */
export function initializeTaskBackup(existingTasks: Array<{
	id: string;
	title: string;
	description: string | null;
	category: string | null;
	priority: string;
	status: string;
	dueDate: Date | null;
	createdAt: Date;
}>): void {
	if (existsSync(BACKUP_PATH)) return;

	const entries: TaskBackupEntry[] = existingTasks.map(task => ({
		id: task.id,
		title: task.title,
		description: task.description,
		category: task.category,
		priority: task.priority,
		status: task.status,
		dueDate: task.dueDate?.toISOString() ?? null,
		createdAt: task.createdAt.toISOString(),
		backedUpAt: new Date().toISOString(),
	}));

	writeBackup(entries);
}
