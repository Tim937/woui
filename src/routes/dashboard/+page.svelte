<script lang="ts">
	import { success } from "zod";
    import CardClient from "$lib/modules/client/+cardClient.svelte";
    let {data, form}=$props();
</script>

<p>Agence  : {data.user.name}</p>


<h2 class="font-bold mb-2">Vos clients</h2>

<form method="POST" class="mb-4">
    <label for="newClientMessage" class="font-bold">un message</label>
    <input type="text" name="newClientMessage" id="newClientMessage" class="border-2" value="">
    <label for="newClient" class="font-bold">ajouter le client</label>
    <input type="email" name="newClient" id="newClient" class="border-2" value="">
    <input type="submit" value="envoyer le lien">
    <!-- <button class="bg-green-100">envoyer le lien</button> -->
</form>


{#if form?.success}
    <div class="mb-4">
        <p>le message {form.message}</p>
        <p>email envoyé à {form.email}</p>
        <p>token : {form.link}</p>
    </div>

{/if}



<!-- Clients List -->
 <!-- <div class="bg-yellow-100 p-4 my-2">
    <p>Debug - Nombre de clients : {data.clients?.length ?? 'undefined'}</p>
    <pre>{JSON.stringify(data.clients, null, 2)}</pre>
</div> -->

<!-- DASHBOARD -->

<div class="wrapper-full grid grid-cols-2">
    

    {#if data.clients}
        <ul>
            {#each data.clients as client} 
                <li class="mb-4"> <CardClient {client} /> </li>
            {/each}
        </ul>
    {/if}
    
</div>
