<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header class="relative flex items-center bg-gray text-dark z-100 h-17">

	<a href="/admin/tasks" class="hover:text-white/50">todo</a>
	<a href="/dashboard" class="hover:text-white/50">dashboard</a>
	<form class="ml-auto mr-0" method="POST" action="?/addSlot" use:enhance>
      <Button variant="plus" shape="round" class="bg-gray-light" classIcon="bg-red"></Button>
    </form>
	<form method="POST" action="?/defaultSlot" use:enhance>
      <Button variant="plus" shape="round" class="bg-gray-light" classIcon="bg-yellow"></Button>
    </form>
	<Button variant="plus" shape="round" class="bg-gray-light" classIcon="bg-white"></Button>


</header>

{@render children()}
