<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  type IconType = 'search' | 'plus' | 'trash';

  interface Props extends SVGAttributes<SVGSVGElement> {
    type: IconType;
    size?: number | string;
    customColor?: string;
    className?: string;

  }
  const version = import.meta.env.DEV ? Date.now() : '1';
  let { customColor, className, type, size, ...rest }: Props = $props();
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
  width={size ?? '1rem'}
  height={size ?? '1rem'}
  aria-hidden="true"
  {...rest}
  class="{customColor ?? 'stroke-dark'} {className ?? ''}"

>
  <use href="/icons.svg?v={version}#{type}" />
</svg>
