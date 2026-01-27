<script lang="ts">
	import { success } from "zod";
    import Icon from '$lib/components/Icon.svelte';
	import Searchbar from "$lib/components/Searchbar.svelte";
  
    let {data, form}=$props();
</script>

<p>Agence  : {data.user.name}</p>

<Searchbar />
<h2 class="font-bold mb-2">Vos clients</h2>
<ul>
    {#each data.clients as client}
        <li>{client.name}</li>
    {/each}
</ul>



<form method="POST" class="">
    <label for="newClientMessage" class="font-bold">un message</label>
    <input type="text" name="newClientMessage" id="newClientMessage" class="border-2" value="">
    <label for="newClient" class="font-bold">ajouter le client</label>
    <input type="email" name="newClient" id="newClient" class="border-2" value="">
    <input type="submit" value="envoyer le lien">
    <!-- <button class="bg-green-100">envoyer le lien</button> -->
</form>

{#if form?.success}
    <p>le message {form.message}</p>
    <p>email envoyé à {form.email}</p>
    <p>token : {form.link}</p>
{/if}