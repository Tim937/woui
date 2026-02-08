<script lang="ts">
  import { enhance } from '$app/forms';
  import Tasksbar from "$lib/components/Tasksbar.svelte";
  import Taskscard from "$lib/components/Taskscard.svelte";
  import Button from "$lib/components/Button.svelte";
  import { useSortable } from '$lib/utils/useDragAndDrop.svelte';

  let { data, form } = $props();

  // Options de tri
  type SortOption = 'date' | 'priority' | 'category' | 'custom';
  let sortBy = $state<SortOption>('date');

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date', label: 'Date' },
    { value: 'priority', label: 'Priorité' },
    { value: 'category', label: 'Catégorie' },
    { value: 'custom', label: 'Mon tri' },
  ];

  // Ordre des priorités pour le tri
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  // Ordre custom pour le drag & drop (juste les IDs)
  let customOrder = $state<string[] | null>(null);

  // Tâches triées — dérivé directement de data.tasks (pas de $effect)
  let sortedTasks = $derived.by(() => {
    const tasks = [...(data.tasks || [])];

    if (sortBy === 'custom' && customOrder) {
      const order = customOrder;
      const ordered = order
        .map(id => tasks.find(t => t.id === id))
        .filter((t): t is NonNullable<typeof t> => t != null);
      const remaining = tasks.filter(t => !order.includes(t.id));
      return [...ordered, ...remaining];
    }

    return tasks.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      }

      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      if (sortBy === 'category') {
        const catA = a.category || 'zzz';
        const catB = b.category || 'zzz';
        return catA.localeCompare(catB);
      }

      return 0;
    });
  });

  // Drag & Drop
  const { sortable, isDragging, isDragOver } = useSortable({
    onReorder: async (group, newOrder) => {
      if (group === 'tasks') {
        sortBy = 'custom';
        customOrder = newOrder;
      }
    },
  });
</script>

<div class="relative min-h-screen pb-20">
  <img src="/tasks/logo-todo.svg" alt="ile de la réunion" srcset="" class="fixed top-5 left-5 w-40 h-auto object-cover z-2">
  <img src="/tasks/bg-re-1.webp" alt="ile de la réunion" srcset="" class="fixed top-0 left-0 h-screen w-screen object-cover z-0">

  <!-- Background -->
  <div class="absolute top-0 left-0 h-full w-screen bg-linear-to-b from-green-re/60 to-green-re/90 z-1"></div>
  <div class="fixed top-0 left-0 grain h-full w-screen z-1 opacity-5"></div>

  <!-- Rentrer les tâches -->
  <Tasksbar classSearch="wrapper-med w-full relative min-h-18 my-30 mx-auto z-2" formAction="?/create" {form}/>

  <!-- Barre de filtres -->
  <div class="wrapper-med relative flex items-center justify-center gap-8 mt-8 z-2">

      {#each sortOptions as option}
        <button
          type="button"
          onclick={() => sortBy = option.value}
          class=" glass border-gradient glass-hover px-4 py-2 rounded-lg transition-colors
          { sortBy === option.value ? 'active' : ''}"
        >
          {option.label}
        </button>
      {/each}
    
    <form action="?/deleteAll" method="POST" use:enhance>
      <Button variant="delete" color="text-white" classButton="w-10 h-10 glass glass-hover rounded-full flex items-center justify-center border-gradient"></Button>
    </form>
  </div>

  <!-- Liste des tâches -->
  <section class="wrapper-med relative mt-6 z-2">
    {#if sortedTasks.length}
      <ul class="flex flex-col gap-8" use:sortable>
        {#each sortedTasks as task (task.id)}
          <li
            data-drag-key={task.id}
            data-drag-group="tasks"
            class="flex items-start gap-2">
           <Taskscard task={{ ...task, dragging: isDragging(task.id), dragOver: isDragOver(task.id) }} />
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-center text-white py-12">Aucune tâche</p>
    {/if}
  </section>
</div>
