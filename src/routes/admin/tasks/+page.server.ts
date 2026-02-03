import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks, taskCategoryOrder } from '$lib/server/db/schemas';
import { eq, isNotNull, asc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { taskSchema } from '$lib/server/db/validation';

// NOTE : Protection admin gérée par hooks.server.ts

export const load: PageServerLoad = async () => {
  const allTasks = db.select().from(tasks).all();
  const categoryOrder = db.select()
    .from(taskCategoryOrder)
    .orderBy(asc(taskCategoryOrder.position))
    .all()
    .map(c => c.category);

  return { tasks: allTasks, categoryOrder };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();

    const title = formData.get('title') as string || 'Sans titre';
    const data = {
      title: title,
      description: undefined,
      category: formData.get('category') || undefined,
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
      category: result.data.category,
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
      priority: formData.get('priority') || 'low',
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

  updateDescription: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const description = formData.get('description') as string;

    db.update(tasks)
      .set({ description })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  updateTitle: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;

    db.update(tasks)
      .set({ title })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const currentStatus = formData.get('status') as string;

    const nextStatus = {
      'todo': 'in_progress',
      'in_progress': 'done',
      'done': 'todo'
    }[currentStatus] || 'todo';

    db.update(tasks)
      .set({ status: nextStatus as 'todo' | 'in_progress' | 'done' })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  updatePriority: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const priority = formData.get('priority') as 'low' | 'medium' | 'high';

    db.update(tasks)
      .set({ priority })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  updateCategory: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const category = formData.get('category') as string || null;

    db.update(tasks)
      .set({ category })
      .where(eq(tasks.id, id))
      .run();

    return { success: true };
  },

  renameCategory: async ({ request }) => {
    const formData = await request.formData();
    const oldCategory = formData.get('oldCategory') as string;
    const newCategory = formData.get('newCategory') as string;

    db.update(tasks)
      .set({ category: newCategory })
      .where(eq(tasks.category, oldCategory))
      .run();

    return { success: true };
  },

  deleteCategory: async ({ request }) => {
    const formData = await request.formData();
    const category = formData.get('category') as string;

    // Supprimer les tasks de cette catégorie
    db.delete(tasks)
      .where(eq(tasks.category, category))
      .run();

    // Supprimer l'ordre de cette catégorie
    db.delete(taskCategoryOrder)
      .where(eq(taskCategoryOrder.category, category))
      .run();

    return { success: true };
  },

  saveCategoryOrder: async ({ request }) => {
    const formData = await request.formData();
    const orderJson = formData.get('order') as string;
    const order: string[] = JSON.parse(orderJson);

    // Supprimer l'ancien ordre
    db.delete(taskCategoryOrder).run();

    // Insérer le nouvel ordre
    for (let i = 0; i < order.length; i++) {
      db.insert(taskCategoryOrder).values({
        category: order[i],
        position: i,
      }).run();
    }

    return { success: true };
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    db.delete(tasks).where(eq(tasks.id, id)).run();
    
    return { success: true };
  },
  deleteAll: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    db.delete(tasks).where(isNotNull(tasks.id)).run();
    
    return { success: true };
  },
};
