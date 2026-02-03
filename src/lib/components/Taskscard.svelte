<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from "$lib/components/Button.svelte";

 interface Props {
  task: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    status: 'todo' | 'in_progress' | 'done'; 
    priority: 'low' | 'medium' | 'high';
    dueDate: Date | null;
    createdAt: Date;
  };
}
let {task}: Props = $props();
</script>

<div class="w-full rounded-lg shadow-md p-4 bg-white">

  <div class="flex items-center gap-2.5">
  <form action="?/updateStatus" method="POST" use:enhance>
    <input type="hidden" name="id" value={task.id} />
    <input type="hidden" name="status" value={task.status} />
    <Button variant="check"></Button>
  </form>
    <span class="ring ring-important/50 bg-important h-4 w-4 rounded-full"></span>
    <form action="?/updatePriority" method="POST" use:enhance class="inline">
      <input type="hidden" name="id" value={task.id} />
      <select name="priority" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="text-important font-bold bg-transparent">
        <option value="low" selected={task.priority === 'low'}>low</option>
        <option value="medium" selected={task.priority === 'medium'}>medium</option>
        <option value="high" selected={task.priority === 'high'}>high</option>
      </select>
    </form>
    {#if task.dueDate}
      <span class="text-dark">{task.dueDate.toLocaleDateString()}</span>
    {/if}
  </div>

  <form action="?/updateCategory" method="POST" use:enhance class="mt-2">
    <input type="hidden" name="id" value={task.id} />
    <input
      type="text"
      name="category"
      class="text-grey-dark uppercase text-sm bg-transparent w-full"
      value={task.category || ''}
      placeholder="Catégorie..."
    />
  </form>
  <form action="?/updateTitle" method="POST" use:enhance>
    <input type="hidden" name="id" value={task.id} />
    <input type="text" name="title" class="text-xl bg-transparent w-full" value={task.title} />
  </form>
  {#if task.description}
    <p class="text-dark mt-2">{task.description}</p>
  {:else}
    <form action="?/updateDescription" method="POST" use:enhance>
      <input type="hidden" name="id" value={task.id} />
      <input type="text" name="description" placeholder="Ajouter une description" />
    </form>
  {/if}

  <form action="?/delete" method="POST" use:enhance>
    <input type="hidden" name="id" value={task.id} />
    <Button variant="delete"></Button>
  </form>
</div>