<script lang="ts">
// Les Props
import type { cardClientDatas } from "./type";
let {client}: {client: cardClientDatas} = $props();

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
  
        <a  href="#" class="block" aria-label="ouvrir la page client" title="ouvrir la page client">
            <h3 class="text-2xl leading-xl">{client.name} {client.surname}*</h3>
        </a>

        <!-- block utils -->

        <button title="open status of trip" class="ml-auto mr-2 w-8 h-8 bg-red rounded-full border-l border-gray"></button>
        <button title="open client chats" class=" w-8 h-8 bg-red rounded-full"></button>
       
    </div>
    <div class="p-4">
    {#if client.trips}
        <ul class="">
            <!-- {#each client.trips as trip}
            <li>{trip.destination}</li>
            {/each} -->
            <li>4 jours dans le Queyras</li>
            <li>Traversée du Jura</li>
        </ul>
    {/if}

    <!-- block client trips -->
        <button  title="open client trip" class="h-4 w-4 bg-red"></button>
    </div>

</div>