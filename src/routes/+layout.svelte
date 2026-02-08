<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header class="relative bg-dark text-white z-100">
	<nav>
		<a href="/admin/tasks" class="hover:text-white/50">todo</a>
		<a href="/dashboard" class="hover:text-white/50">dashboard</a>
	</nav>
</header>

{@render children()}
