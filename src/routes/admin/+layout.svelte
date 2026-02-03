<script lang="ts">
	let { children } = $props();
</script>

<!-- Header spécifique admin -->
<header class="bg-primary h-8">
</header>
<main class="flex flex-col min-h-screen">
{@render children()}
</main>
