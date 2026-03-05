<script lang="ts">
    import Icon from '$lib/components/Icon.svelte';
    import type {HTMLButtonAttributes} from 'svelte/elements';
	import type { Snippet } from 'svelte';

    interface Props extends HTMLButtonAttributes {
        variant: 'delete' | 'check' | 'chat' | 'wait' | 'plus' | 'user' | 'slots' | 'close';
        shape?:'round'|'long'|'text';
        classIcon?:string;
        children?: Snippet;
    }
    const shapes: Record<string, string> = {
        round: 'w-12 h-12 rounded-full flex items-center justify-center border border-gray ',
        long:'w-max h-12 rounded-md flex items-center py-2 pl-3.5 pr-4 ',
        text: 'flex items-center justify-center ',
    };

    const icon : Record<string, string> = {
        default:'w-8 h-8 flex items-center justify-center border-2 border-dark rounded-full '
    }

    let { variant, shape, classIcon, class: className, children, ...rest }: Props = $props();

</script>

<button class="{shape ? shapes[shape] : ''} {className ?? ''}" {...rest}>
    {#if classIcon}
    <span class="{icon['default']} {shape === 'long' ? 'mr-2 ' : ''} {classIcon ?? ''}">
        <Icon type={variant} size="w-3.5 h-3.5" color="text-dark"/>
    </span>
    {/if} 
    {#if children}
        {@render children()}
    {/if}

</button>