import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { taskSchema } from '$lib/server/db/validation';

// NOTE : Protection admin gérée par hooks.server.ts 

export const load: PageServerLoad = async () => {
  const allTasks = db.select().from(tasks).all();
  return { tasks: allTasks };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const data = {
      title: formData.get('title'),
      description: formData.get('description') || undefined,
      status: formData.get('status') || 'todo',
      priority: formData.get('priority') || 'medium',
      dueDate: formData.get('dueDate') || undefined,
    };

    const result = taskSchema.safeParse(data);
    if (!result.success) {
      return fail(400, { error: result.error.flatten().fieldErrors });
    }

    db.insert(tasks).values({
      title: result.data.title,
      description: result.data.description,
      status: result.data.status,
      priority: result.data.priority,
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
    }).run();

    return { success: true };
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const data = {
      title: formData.get('title'),
      description: formData.get('description') || undefined,
      status: formData.get('status') || 'todo',
      priority: formData.get('priority') || 'medium',
      dueDate: formData.get('dueDate') || undefined,
    };

    const result = taskSchema.safeParse(data);
    if (!result.success) {
      return fail(400, { error: result.error.flatten().fieldErrors });
    }

    db.update(tasks)
      .set({
        title: result.data.title,
        description: result.data.description,
        status: result.data.status,
        priority: result.data.priority,
        dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
      })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    db.delete(tasks).where(eq(tasks.id, id)).run();

    return { success: true };
  },
};
