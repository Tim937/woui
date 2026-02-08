<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import TaskField from "$lib/components/TaskField.svelte";
	import Icon from "./Icon.svelte";

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
      dragging?: boolean;    // ← ici
      dragOver?: boolean;    // ← ici
    };
    dragKey?: string;
    dragGroup?: string;
  }

  let { task, dragKey, dragGroup }: Props = $props();

  // État local pour le titre (préserve l'undo du navigateur)
  let localTitle = $state('');
  let titleFocused = $state(false);

  $effect(() => {
    if (!titleFocused) localTitle = task.title;
  });

  function autoSubmit(e: Event) {
    (e.currentTarget as HTMLInputElement | HTMLSelectElement).form?.requestSubmit();
  }

  function autoSubmitIfChanged(e: Event, originalValue: string | null) {
    const input = e.currentTarget as HTMLInputElement;
    if (input.value !== (originalValue ?? '')) {
      input.form?.requestSubmit();
    }
  }
 
</script>

<div
  class="glass border-gradient flex items-center w-full rounded-4xl py-7 px-5 pr-14 relative transition-transform duration-200 z-2 overflow-hidden 
  {task.dragging ? 'opacity-50' : ''} {task.dragOver ? 'opacity-90 ring-4 ring-white/20' : ''}"
 
  data-drag-key={dragKey}
  data-drag-group={dragGroup}>

    <!--Bouton de statut / Bouton delete-->
    <div class="flex flex-col items-center justify-center align-center mr-4">
      <TaskField action="updateStatus" id={task.id}>
        <input type="hidden" name="status" value={task.status} />
        <Button variant="check" color="text-white" classButton="border rounded-full flex items-center justify-center {task.status === 'todo' ? 'bg-white/20 hover:bg-white/10' : task.status === 'in_progress' ? 'bg-dark/30 hover:bg-dark/10' : 'bg-green-light-re/80 hover:bg-green-light-re/60 anim-validation'}">
          {#if task.status === "done"}
            <Icon type="check" width="1rem"></Icon>
          {:else if task.status === "in_progress"}
            <Icon type="wait" width="0.75rem"></Icon>
          {/if}
        </Button>
      </TaskField>

      {#if task.status === "done"}
      <TaskField action="delete" id={task.id} class="mt-2" >
        <Button variant="delete" classButton="text-white hover:text-white/40  border border-white/20 w-8 h-8 rounded-full flex items-center justify-center bg-red-re/80 hover:bg-red-re/60"></Button>
      </TaskField>
      {/if}
    </div>

      <TaskField action="updateCategory" id={task.id} class="absolute top-1 left-17">
      <input
        type="text"
        name="category"
        class="text-grey uppercase font-medium text-sm bg-transparent w-full p-1 rounded-sm "
        value={task.category || ''}
        placeholder="Catégorie..."
        onblur={(e) => autoSubmitIfChanged(e, task.category)}
      />
    </TaskField>
    
    <TaskField action="updateTitle" id={task.id} class="w-full ">
      <input
        type="text"
        name="title"
        class="text-2xl bg-transparent w-full font-bold text-white py-2 p-1 rounded-sm {task.status === "done" ? "line-through text-white/60" : ""}"
        bind:value={localTitle}
        onfocus={() => titleFocused = true}
        onblur={(e) => { titleFocused = false; autoSubmitIfChanged(e, task.title); }}
      />
    </TaskField>

    {#if task.description}
      <p class="text-dark mt-2">{task.description}</p>
      <TaskField action="updateDescription" id={task.id}>
        <textarea
          name="description"
          placeholder="Ajouter une description"
          onblur={(e) => autoSubmitIfChanged(e, task.description)}
        >
        </textarea>
      </TaskField>
    {/if}


  {#if task.dueDate}
    <span class="text-dark">{task.dueDate.toLocaleDateString()}</span>
  {/if}


    <TaskField action="updatePriority" id={task.id} class="cursor-pointer block mx-auto mr-0 glass glass-hover bg-dark/40 border border-white/30 rounded-2xl">
      <select name="priority" onchange={autoSubmit} class="px-6 py-3 font-bold bg-transparent h-full w-full cursor-pointer {task.priority === "low" ? "text-white" : task.priority === "medium" ? "text-orange-re" : "text-red-re"}">
        <option value="low" selected={task.priority === 'low'}>low</option>
        <option value="medium" selected={task.priority === 'medium'}>medium</option>
        <option value="high" selected={task.priority === 'high'}>high</option>
      </select>
    </TaskField>
    <span
        data-drag-handle
        class="absolute top-0 right-0 h-full w-10  flex items-center cursor-grab active:cursor-grabbing text-2xl text-white hover:text-white/40  duration-100 transform-all select-none px-2
        {task.priority === "low" ? "bg-white/15 hover:bg-white/10" : task.priority === "medium" ? "bg-orange-re/60 hover:bg-orange-re/50" : "bg-red-re/60 hover:bg-red-re/50"}"
        
        title="Glisser pour réorganiser"
      >⋮⋮</span>

</div>
