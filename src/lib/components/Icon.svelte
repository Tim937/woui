<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  type IconType = 'search' | 'plus' | 'trash';

  interface Props extends SVGAttributes<SVGSVGElement> {
    type: IconType;
    size?: number | string;
    defaultClass?: string;
  }
  const version = import.meta.env.DEV ? Date.now() : '1';
  let { defaultClass, type, size, ...rest }: Props = $props();
</script>

<!-- utilisation
<script>
  import Icon from '$lib/components/Icon.svelte';
</script>

<Icon type="search" />
<Icon type="search" size={32} />
<Icon type="search" size={16} class="text-blue-500" /> 
-->

<svg
  width={size ?? '2rem'}
  height={size ?? '2rem'}
  aria-hidden="true"
  class={rest.class ?? 'text-dark'}
  {...rest}
>
  <use href="/icons.svg?v={version}#{type}" />
</svg>
