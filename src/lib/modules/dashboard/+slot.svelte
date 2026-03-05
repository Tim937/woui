<script lang="ts">
  import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
  import CardClient from '$lib/modules/client/+cardClient.svelte';

  type SlotType = 'clients' | 'stats' | 'chats' | 'meets' | null;
  type Slot = { id: string; position: number; type: SlotType };

  let { slot, clients }: { slot: Slot; clients: any[] } = $props();
</script>

<div class="rounded-md border border-gray bg-gray-light p-2">

  <!-- Header : dropdown + supprimer -->
  <div class="flex justify-between items-center">
    <form method="POST" action="?/updateSlotType" use:enhance>
      <input type="hidden" name="id" value={slot.id} />
      <select class="font-bold"name="type" onchange={(e) => e.currentTarget.form?.requestSubmit()}>
        <option value="">Module</option>
        <option value="clients" selected={slot.type === 'clients'}>Clients</option>
        <option value="stats"   selected={slot.type === 'stats'}>Stats</option>
        <option value="chats"   selected={slot.type === 'chats'}>Chats</option>
        <option value="meets"   selected={slot.type === 'meets'}>Rendez-vous</option>
      </select>
    </form>

    <form method="POST" action="?/removeSlot" use:enhance>
        <input type="hidden" name="id" value={slot.id} />
        <Button type="submit" variant="close" shape="round" classIcon="bg-white"></Button>
    </form>

  </div>

  <!-- Contenu -->
  <div class="h-full w-full bg-white/80 p-4">
    
    {#if slot.type === 'clients'}
      <ul>
        {#each clients as client}
            <li class="mb-4"> <CardClient {client} /> </li>
        {/each}
      </ul>
    {:else if slot.type === 'stats'}
      <p>[ module stats ]</p>
    {:else if slot.type === 'chats'}
      <p>[ module chats ]</p>
    {:else if slot.type === 'meets'}
      <p>[ module rendez-vous ]</p>
    {:else}
      <p>Ajouter votre premier module</p>
    {/if}
  </div>

</div>
