<script lang="ts">
	import { enhance } from '$app/forms';
	import Tasksbar from "$lib/components/Tasksbar.svelte";
	import Taskscard from "$lib/components/Taskscard.svelte";
	import Button from "$lib/components/Button.svelte";

    let {data, form}=$props();

    // Ordre personnalisé des catégories (chargé depuis la DB)
    let categoryOrder = $state<string[]>([]);

    // Initialiser l'ordre depuis les données serveur
    $effect(() => {
      if (data.categoryOrder?.length && categoryOrder.length === 0) {
        categoryOrder = [...data.categoryOrder];
      }
    });

    // Fonction pour sauvegarder l'ordre en DB
    async function saveCategoryOrder(order: string[]) {
      const formData = new FormData();
      formData.append('order', JSON.stringify(order));

      await fetch('?/saveCategoryOrder', {
        method: 'POST',
        body: formData,
      });
    }

    let groupedCategories = $derived.by(() => {
      const grouped:Record<string, typeof data.tasks> = {};
      for( const task of data.tasks || []){
        const cat =  task.category || 'Sans'
        if(!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(task);
      }
        const allCatNames = Object.keys(grouped);
        // Format : [{ name: 'Urgent', tasks: [...] }, { name: 'Projets', tasks: [...] }]
        const sortedNames = allCatNames.sort((a,b) => {
            if(a === 'Sans') return -1
            if(b === 'Sans') return 1

            const indexA =  categoryOrder.indexOf(a);
            const indexB =  categoryOrder.indexOf(b);

            if(indexA === -1 && indexB === -1) return 0;
            if(indexA === -1) return 1;
            if(indexB === -1) return -1;

            return indexA - indexB;
             
        });

        return sortedNames.map(name => ({
          name,
          tasks:grouped[name]
        }));
      
    }) 

    // Drag and drop state
    let draggedCategory = $state<string | null>(null);
    let dragOverCategory = $state<string | null>(null);

    function handleDragStart(category: string) {
      if (category === 'Sans catégorie') return;
      draggedCategory = category;
    }

    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }

    function handleDragEnter(category: string) {
      if (draggedCategory && category !== draggedCategory) {
        dragOverCategory = category;
      }
    }

    function handleDragLeave(e: DragEvent, category: string) {
      const relatedTarget = e.relatedTarget as Node | null;
      const currentTarget = e.currentTarget as Node | null;
      if (!currentTarget || !relatedTarget || !(currentTarget as Element).contains(relatedTarget)) {
        if (dragOverCategory === category) {
          dragOverCategory = null;
        }
      }
    }

   async function handleDrop(targetCategory: string) {
    // 1. Sécurité : On ne bouge rien si c'est invalide ou si c'est "Sans catégorie"
    if (!draggedCategory || targetCategory === 'Sans catégorie' || draggedCategory === targetCategory) {
        draggedCategory = null;
        return;
    }

    // 2. Récupérer uniquement les NOMS des catégories (sauf "Sans catégorie") 
    // à partir de notre nouvelle structure dérivée
    const currentCatsNames: string[] = groupedCategories.map((c: { name: string }) => c.name).filter((name: string): name is string => name !== 'Sans catégorie');

    const fromIndex = currentCatsNames.indexOf(draggedCategory);
    const toIndex = currentCatsNames.indexOf(targetCategory);

    if (fromIndex !== -1 && toIndex !== -1) {
        // Sauvegarde de l'ancien état pour le Rollback (Optimistic UI)
        const previousOrder = [...categoryOrder];

        // 3. Calcul du nouvel ordre
        const newOrder = [...currentCatsNames];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedCategory);

        // 4. Mise à jour immédiate de l'interface
        categoryOrder = newOrder;

        try {
            // 5. Tentative de sauvegarde en DB
            await saveCategoryOrder(newOrder);
        } catch (error) {
            // 6. Rollback si ça échoue
            categoryOrder = previousOrder;
            console.error("Échec de la sauvegarde :", error);
        }
    }

    draggedCategory = null;
    dragOverCategory = null;
}

function handleDragEnd() {
  draggedCategory = null;
  dragOverCategory = null;
}
</script>

<div class="wrapper-full bg-secondary">

    <Tasksbar classSearch="w-120 h-14 mt-16 mx-auto" formAction="?/create" {form}/>

    <form action="?/deleteAll" method="POST" use:enhance>
      <Button variant="delete"></Button>
    </form>

    <section class="wrapper-full min-h-screen mt-8 overflow-x-auto">
      {#if data.tasks?.length}
        <div class="flex gap-6">
          {#each groupedCategories as categoryGroup}
              <ul
                class="flex flex-col gap-4 min-w-80"
                draggable={categoryGroup.name !== 'Sans catégorie'}
                ondragstart={() => handleDragStart(categoryGroup.name)}
                ondragover={handleDragOver}
                ondragenter={() => handleDragEnter(categoryGroup.name)}
                ondragleave={(e) => handleDragLeave(e, categoryGroup.name)}
                ondrop={() => handleDrop(categoryGroup.name)}
                ondragend={handleDragEnd}
                class:opacity-50={draggedCategory === categoryGroup.name}
                class:cursor-grab={categoryGroup.name !== 'Sans catégorie'}
                class:active={dragOverCategory === categoryGroup.name}
              >
                <li>
                {#if categoryGroup.name !== 'Sans catégorie'}
                  <form action="?/renameCategory" method="POST" use:enhance class="flex-1">
                    <input type="hidden" name="oldCategory" value={categoryGroup.name} />
                    <input
                      type="text"
                      name="newCategory"
                      class="font-bold text-lg bg-transparent w-full"
                      value={categoryGroup.name}
                    />
                  </form>
                  <form action="?/deleteCategory" method="POST" use:enhance>
                    <input type="hidden" name="category" value={categoryGroup.name} />
                    <Button variant="delete"></Button>
                  </form>
                {:else}
                  <h2 class="font-bold text-lg">{categoryGroup.name}</h2>
                {/if}</li>
                {#each categoryGroup.tasks as task}
                  <li>
                    <Taskscard {task}></Taskscard>
                  </li>
                {/each}
              </ul>
          {/each}
        </div>
      {:else}
        <p class="text-center text-grey-dark">Aucune tâche</p>
      {/if}
    </section>
</div>

