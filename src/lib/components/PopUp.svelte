<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    children: Snippet;
  }

  let { open = $bindable(false), children }: Props = $props();
</script>

{#if open}
  <div
    class="fixed top-0 left-0 h-screen w-screen bg-dark/80 z-50 flex items-center justify-center"
    role="button"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) open = false; }}
    onkeydown={(e) => { if (e.key === 'Escape') open = false; }}
  >
    <button
      class="fixed top-0 left-0 h-10 w-10 bg-red hover:bg-white"
      onclick={() => open = false}
      aria-label="Fermer"
      type="button"
    >×</button>
    {@render children()}
  </div>
{/if}
