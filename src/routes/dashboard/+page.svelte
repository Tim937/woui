<script lang="ts">
    let {data}=$props();

</script>

<p>Email  : {data.user.email}</p>


<ul>
    {#each data.clients as client}
        <li>{client.name}</li>
    {/each}
</ul>