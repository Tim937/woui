<script lang="ts">
	import Tasksbar from "$lib/components/Tasksbar.svelte";
	import Button from "$lib/components/Button.svelte";

    let {data, form}=$props();
</script>

<div class="wrapper-full flex justify-center bg-secondary h-screen w-full">
<Tasksbar classSearch="w-120 h-14 mt-20" formAction="?/create" {form}/>   
    


{#if data.tasks?.length}
<div>
    <ul>
        {#each data.tasks as task}
            <li>
                {#if task.category}
                    <p class="font-sm uppercase text-gray-400">{task.category}</p>
                      {/if}
                {task.description}

                <form action="?/delete" method="POST">
                    <input type="hidden" name="id" value={task.id} />
                    <Button variant="delete"></Button>
                </form>
            </li>
        {/each}
    </ul>
</div>
{/if}

</div>
