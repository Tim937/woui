<script lang="ts">
	let { children } = $props();
</script>

<!-- Header spécifique admin -->
<!-- <header class="fixed top-0 left-0 w-full bg-white/30 h-8 z-2">
</header> -->
<main class="flex flex-col min-h-screen">
{@render children()}
</main>
