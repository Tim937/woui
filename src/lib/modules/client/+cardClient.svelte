<script lang="ts">
// Les Props
import type { cardClientDatas } from "./type";
import Button from "$lib/components/Button.svelte"


    let {client}: {client: cardClientDatas} = $props();
    let showAll = $state(false);
</script>


<!-- 

datas : 
    - client
    - clientTrips
    - clientChats

-Dashboard


-->

<div class="flex flex-col rounded-md border-gray-dark border border-gray bg-gray-light">

    <!--  -->
    <div class="flex items-center justify-between border-b border-gray h-16 px-4">

        <!-- block client name -->
  
        <a  href="/client/{client.id}" class="block" aria-label="ouvrir la page client" title="ouvrir la page client">
            <h3 class="text-2xl leading-xl">{client.name} {client.surname}*</h3>
        </a>

        <!-- block buttons utils -->

        <div class="flex items-center justify-between border-l h-full border-gray ml-auto mr-0 px-5">
            <Button variant="wait" shape="round" class="mr-3" classIcon="bg-yellow"></Button>
            <Button variant="chat" shape="round" class="mr-3" classIcon="bg-white"></Button>
            <Button variant="chat" shape="round" class=""></Button>
        </div>
      
    </div>
    <div class="p-4">
    {#if client.trips}
        <ul class="max-h-30">
            <!-- {#each client.trips as trip}
            <li>{trip.destination}</li>
            {/each} -->
            
            <li>Traversée du Jura</li>
            {#if showAll} 
                <li>4 jours dans le Queyras</li>
                <li>un autre séjour</li>
                <li>encore un autre</li>
            {/if}
        </ul>
        <Button variant="plus" shape="round" class="mt-2" classIcon="bg-white" onclick={() => showAll = !showAll}></Button>
    {/if}
    </div>

</div>