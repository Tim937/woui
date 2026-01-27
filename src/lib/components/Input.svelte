<script lang="ts">
  import type {HTMLInputAttributes} from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
    labelClass?:string;
    error?:string;
  }

  let {label, labelClass, error, ...rest}: Props = $props();

</script>

  {#if label}
    <label for={rest.id} class={labelClass}>{label}</label>
    <input  class="hidden" {...rest} />
  {:else}
    <input {...rest} />
  {/if}
  {#if error}
    <span>{error}</span>
  {/if}
