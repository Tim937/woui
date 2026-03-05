<script lang="ts">
	import { success } from "zod";
    import CardClient from "$lib/modules/client/+cardClient.svelte";
    import Search from "$lib/modules/search/+search.svelte"
	import Button from "$lib/components/Button.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import DashboardSlot from "$lib/modules/dashboard/+slot.svelte"
    import PopUp from "$lib/components/PopUp.svelte";
	import { enhance } from "$app/forms";

    let {data, form}=$props();
    let showAll = $state(false);
    let showAddClient = $state(false);

</script>

<p>Agence  : {data.user.name}</p>

<!-- Search -->

<Search />

<h2 class="font-bold mb-2">Vos clients</h2>

<!-- Ajouter un slot -->
<form class="ml-auto mr-0" method="POST" action="?/addSlot" use:enhance>
  <Button variant="slots" shape="long" class="bg-blue" classIcon="bg-white">Ajouter un slot</Button>
</form>

<!-- Ajouter un client -->
<Button variant="slots" shape="long" class="bg-yellow" classIcon="bg-white" onclick={() => showAddClient = true}>Ajouter un client</Button>

<PopUp bind:open={showAddClient}>
  {#snippet children()}
    <form method="POST" action="?/inviteClient" class="mb-4 bg-white p-2 rounded-sm">
        <label for="newClientMessage" class="font-bold">un message</label>
        <input type="text" name="newClientMessage" id="newClientMessage" class="border-2" value="">
        <label for="newClient" class="font-bold">ajouter le client</label>
        <input type="email" name="newClient" id="newClient" class="border-2" value="">
        <input type="submit" value="envoyer le lien">
    </form>
  {/snippet}
</PopUp>

{#if form?.success}
    <div class="mb-4">
        <p>le message {form.message}</p>
        <p>email envoyé à {form.email}</p>
        <p>token : {form.link}</p>
    </div>
{/if}


<div class="flex">

    <!-- ASIDE -->
    <aside class="sticky top-header h-full bg-gray {showAll ? 'w-60' : 'w-10'}">
        <button class="block relative w-8 h-10 ml-1" aria-label = "open the lateral bar" onclick={() => showAll = !showAll}>
            <span class="block w-full h-1 rounded-md bg-dark mb-1.5"></span>
            <span class="block w-full h-1 rounded-md bg-dark"></span>
        </button>
        <ul>
            <li><Icon type="chat" class="m-4"></Icon></li>
            <li><Icon type="chat" class="m-4"></Icon></li>
            <li><Icon type="chat" class="m-4"></Icon></li>
            <li><Icon type="chat" class="m-4"></Icon></li>
            <li><Icon type="chat" class="m-4"></Icon></li>
            <li><Icon type="chat" class="m-4"></Icon></li>
        </ul>
    </aside>


    <!-- DASHBOARD -->
    <div class="wrapper-full grid grid-cols-2 bg-white gap-4 pb-4">

    {#each data.slots as slot}
        <DashboardSlot {slot} clients={data.clients} />
    {/each}

    <!-- {#if data.clients}
        <ul>
            {#each data.clients as client}
                <li class="mb-4"> <CardClient {client} /> </li>
            {/each}
        </ul>
    {/if} -->

    </div>

</div>



<!-- Clients List -->
 <!-- <div class="bg-yellow-100 p-4 my-2">
    <p>Debug - Nombre de clients : {data.clients?.length ?? 'undefined'}</p>
    <pre>{JSON.stringify(data.clients, null, 2)}</pre>
</div> -->
