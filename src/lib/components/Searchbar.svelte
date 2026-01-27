<script lang="ts">
    import type {HTMLInputAttributes} from 'svelte/elements';
    import Icon from '$lib/components/Icon.svelte';
  interface Props extends HTMLInputAttributes {
    labelId?: string;
    labelClass?:string;
  }

  let {labelId,labelClass, ...rest}: Props = $props();

</script>

<div class="bg-primary w-40 h-30">
   <input id={labelId} class=" {rest.class}" type="search">
   <Icon type="plus" />
</div>
