<script lang="ts">
	import { success } from "zod";
    import Icon from '$lib/components/Icon.svelte';
	import Searchbar from "$lib/components/Searchbar.svelte";
  
    let {data, form}=$props();
</script>
<div class="wrapper-big bg-secondary h-screen w-full">
    <Searchbar />
</div>
