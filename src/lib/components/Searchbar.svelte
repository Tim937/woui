<script lang="ts">
    import type {HTMLInputAttributes} from 'svelte/elements';
    import Icon from '$lib/components/Icon.svelte';
  interface Props extends HTMLInputAttributes {
    labelId?: string;
    labelClass?:string;
  }

  let {labelId,labelClass, ...rest}: Props = $props();

</script>

<div class="input-wrapper relative bg-secondary w-120 h-16 rounded-full flex border border-primary">
   <input id={labelId} class="w-full h-full pr-6 {rest.class}" type="search">
   <Icon type="plus" className="absolute right-4 top-1/2 -translate-y-1/2" customColor="text-primary" />
</div>
