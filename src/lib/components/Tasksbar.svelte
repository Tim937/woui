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
  let displayStep = $state(1); // État séparé pour l'affichage de la barre verte
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
    // La réinitialisation est gérée par le $effect sur form?.success
  }

  // Réinitialiser si succès (avec délai de 1s pour l'animation)
  $effect(() => {
    if (form?.success) {
      setTimeout(() => {
        step = 1;
        description = '';
        category = '';
        dueDate = '';
      }, 1000);
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
  <div class="bg-white overflow-hidden z-10 absolute top-3 right-3 w-20 bottom-3 rounded-full flex items-center justify-end {step > 1 ? 'border border-dark' : 'border border-dark'}"
  >
    <span class="absolute left-0 top-0 w-12 h-full inline-block shrink-0 bg-red bg-success z-11 origin-left transition-transform duration-300 ease-out"
    class:scale-x-0={step === 1}
    class:scale-x-50={step === 2}
    class:scale-x-100={step === 3}
    ></span>
    <Icon type="plus" customColor="stroke-primary" classIcon="mx-2"/>
  </div>

  {#if form?.error}
    <div class="text-red-500 text-sm mt-2">
      {JSON.stringify(form.error)}
    </div>
  {/if}
</form>
