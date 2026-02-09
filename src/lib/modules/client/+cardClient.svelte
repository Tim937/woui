<script lang="ts">
// les imports


//Interface Props

// decla des props



</script>


<!-- 

datas : 
    - client
    - clientTrips
    - clientChats
-->


<div>
    <!-- block client name -->
    <h3>{client.name} {client.surname}</h3>
    <a href="#" alt="to user page" class=""></a>

    <!-- block client trips -->
    <button title="open client trip"></button>
    {#if trips}
        <ul>
            {#each trip in trips}
            <li>{trip}</li>
            {/each}
        </ul>
    {/if}
    
    <!-- block utils -->
    <div>
        <button title="open status of trip"></button>
        <button title="open client chats"></button>
    </div>
   
</div>