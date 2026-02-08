<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Snippet } from 'svelte';

  interface Props {
    action: string;
    id: string;
    class?: string;
    children: Snippet;
  }

  let { action, id, class: className = '', children }: Props = $props();
</script>

<form action="?/{action}" method="POST" use:enhance={() => {
  return async ({ update }) => {
    await update({ reset: false });
  };
}} class={className}>
  <input type="hidden" name="id" value={id} />
  {@render children()}
</form>
