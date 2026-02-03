<script lang="ts">
  import type {HTMLInputAttributes} from 'svelte/elements';
  import {enhance} from '$app/forms';
  import {invalidateAll} from '$app/navigation';
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
  let title = $state('');
  let category = $state('');
  let dueDate = $state('');

  // Références aux inputs
  let inputs: HTMLInputElement[] = [];

  // Gestion de la touche Entrée
  function handleKeydown(event: KeyboardEvent, currentStep: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentStep === 1 && title.trim()) {
        step = 2;
      } else if (currentStep === 2) {
        step = 3;
      } else if (currentStep === 3) {
        (event.target as HTMLInputElement).form?.requestSubmit();
        step = 4;
      } else if (currentStep === 4) {

      }
    }
  }


  // Focus automatique lors du changement de step
  $effect(() => {
    inputs[step - 1]?.focus();
  });

</script>

<form
  method="POST"
  action={formAction}
  use:enhance={() => {
    return async ({result}) => {
      // Garder la barre verte pendant 1s
      step = 4;
      setTimeout(async () => {
        step = 1;
        title = '';
        category = '';
        dueDate = '';
        // Recharger les données pour afficher la nouvelle card
        await invalidateAll();
      }, 1000);
    };
  }}
  class="relative bg-white z-0 rounded-full {classSearch}"
>
  <input
    bind:this={inputs[0]}
    id={idSearch}
    class="task z-1"
    class:task-hidden={step > 1}
    type="text"
    bind:value={title}
    name="title"
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
  <button type="submit" class="group bg-white hover:bg-grey transition-all duration-100 overflow-hidden z-10 absolute top-3 right-3 w-20 bottom-3 rounded-full flex items-center justify-end
    hover:shadow-md
    {step > 1 ? 'border border-dark' : 'border border-dark'}"
    >
    <span class="absolute left-0 top-0 w-full h-full inline-block shrink-0 bg-grey z-11 origin-left transition-transform duration-300 ease-out"
      class:scale-x-0={step === 1}
      class:scale-x-33={step === 2}
      class:scale-x-66={step === 3}
      class:scale-x-100={step === 4}
    ></span>
    <div class="relative rounded-full w-5.5 h-5.5 z-12 border border-dark group-hover:scale-80 mr-2 bg-grey flex items-center justify-center"
    class:bg-success={step===4}
    class:anim-validation={step===4}>
      <Icon width="0.6rem" height="0.6rem" type="plus" customColor="stroke-primary" classIcon="group-hover:stroke-violet"/>
    </div>
    
  </button>

  {#if form?.error}
    <div class="text-red-500 text-sm mt-2">
      {JSON.stringify(form.error)}
    </div>
  {/if}
</form>
