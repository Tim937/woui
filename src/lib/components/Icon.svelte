<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  import type {HTMLInputAttributes} from 'svelte/elements';
  type IconType = 'plus' | 'search' | 'delete' | 'check';

  interface Props extends SVGAttributes<SVGElement> {
    type:IconType;
    size?:string;
    color?:string;
    class?:string;
    svg?:string;
  }

  const version = import.meta.env.DEV ? Date.now() : '1';
  let { type, size="w-4 h-4", color="text-dark", class: className = "", ...rest }: Props = $props();

</script>

<svg class="{size} {color} {className}" {...rest} fill="none" >
  <use href="/icons.svg?v={version}#{type}" />
</svg>



