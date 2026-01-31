<script lang="ts">
  import type {HTMLInputAttributes} from 'svelte/elements';
  import Icon from '$lib/components/Icon.svelte';

  interface Props extends HTMLInputAttributes {
    idSearch?: string;
    classSearch?: string;
    form?: any;
    formAction: string;
  }

  let {idSearch, classSearch, formAction, form, ...rest}: Props = $props();

  // États pour le formulaire multi-étapes
  let step = $state(1);
  let description = $state('');
  let category = $state('');
  let dueDate = $state('');

  // Références aux inputs
  let inputs: HTMLInputElement[] = [];

  // Gestion de la touche Entrée
  function handleKeydown(event: KeyboardEvent, currentStep: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentStep === 1 && description.trim()) {
        step = 2;
      } else if (currentStep === 2) {
        step = 3;
      } else if (currentStep === 3) {
        // Soumettre le formulaire
        (event.target as HTMLInputElement).form?.requestSubmit();
      }
    }
  }

  // Réinitialiser après soumission
  function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement;
    setTimeout(() => {
      step = 1;
      description = '';
      category = '';
      dueDate = '';
    }, 100);
  }

  // Réinitialiser si succès
  $effect(() => {
    if (form?.success) {
      step = 1;
      description = '';
      category = '';
      dueDate = '';
    }
  });

  // Focus automatique lors du changement de step
  $effect(() => {
    inputs[step - 1]?.focus();
  });

 
</script>

<form
  method="POST"
  action={formAction}
  class="relative bg-white z-0 rounded-full {classSearch}"
  onsubmit={handleSubmit}
>
  <input
    bind:this={inputs[0]}
    id={idSearch}
    class="task z-1"
    class:task-hidden={step > 1}
    type="text"
    bind:value={description}
    name="description"
    autocomplete="off"
    placeholder="ajouter une tâche"
    required

    readonly={step > 1}
    onkeydown={(e) => handleKeydown(e, 1)}
  >

  <input
    bind:this={inputs[1]}
    class="task z-2"
    class:hidden={step < 2}
    class:task-hidden={step > 2}
    type="text"
    bind:value={category}
    name="category"
    autocomplete="off"
    placeholder="catégorie (optionnel)"
    readonly={step !== 2}
    onkeydown={(e) => handleKeydown(e, 2)}
  >

  <input
    bind:this={inputs[2]}
    class="task z-3"
    class:hidden={step < 3}
    type="date"
    bind:value={dueDate}
    name="dueDate"
    autocomplete="off"
    placeholder="date d'échéance (optionnel)"
    readonly={step !== 3}
    onkeydown={(e) => handleKeydown(e, 3)}
  >
  <div class="z-10 absolute top-1 right-2 w-10 bottom-1 rounded-r-full flex align-center items-center bg-white">
      <Icon type="plus" customColor="stroke-primary"/>

  </div>

  {#if form?.error}
    <div class="text-red-500 text-sm mt-2">
      {JSON.stringify(form.error)}
    </div>
  {/if}
</form>
