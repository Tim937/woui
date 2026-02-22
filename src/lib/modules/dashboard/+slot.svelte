<script lang="ts">
  import { enhance } from '$app/forms';
  import CardClient from '$lib/modules/client/+cardClient.svelte';

  type SlotType = 'clients' | 'stats' | 'chats' | 'meets' | null;
  type Slot = { id: string; position: number; type: SlotType };

  let { slot, clients }: { slot: Slot; clients: any[] } = $props();
</script>

<div class="rounded-md border border-gray bg-gray-light">

  <!-- Header : dropdown + supprimer -->
    <form method="POST" action="?/updateSlotType" use:enhance>
          <input type="hidden" name="id" value={slot.id} />
          <select name="type" onchange={(e) => e.currentTarget.form?.requestSubmit()}>
            <option value="">— module —</option>
            <option value="clients" selected={slot.type === 'clients'}>Clients</option>
            <option value="stats"   selected={slot.type === 'stats'}>Stats</option>
            <option value="chats"   selected={slot.type === 'chats'}>Chats</option>
            <option value="meets"   selected={slot.type === 'meets'}>Rendez-vous</option>
          </select>
    </form>
    <form method="POST" action="?/removeSlot" use:enhance>
      <input type="hidden" name="id" value={slot.id} />
      <button type="submit">×</button>
    </form>


  <!-- Contenu -->
  <div>
    
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
      <p>Slot vide</p>
    {/if}
  </div>

</div>
