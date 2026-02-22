<script lang="ts">
    import Icon from '$lib/components/Icon.svelte';
    import type {HTMLButtonAttributes} from 'svelte/elements';
	import type { Snippet } from 'svelte';

    interface Props extends HTMLButtonAttributes {
        variant: 'delete' | 'check' | 'chat' | 'wait' | 'plus';
        shape?:'round'|'text';
        classIcon?:string;
        children?: Snippet;
    }
    const shapes: Record<string, string> = {
        round: 'w-12 h-12 rounded-full flex items-center justify-center border border-gray',
        text: 'flex items-center justify-center ',
    };

    let { variant, shape, classIcon, class: className, children, ...rest }: Props = $props();

</script>

<button class="{shape ? shapes[shape] : ''} {className ?? ''}" {...rest}>

    {#if children}
        {@render children()}
    {/if}
    {#if classIcon}
    <span class="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-full {classIcon ?? ''}">
        <Icon type={variant} size="w-3.5 h-3.5" color="text-dark"/>
    </span>
    {/if} 
</button>