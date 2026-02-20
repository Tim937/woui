<script lang="ts">
    import Icon from '$lib/components/Icon.svelte';
    import type {HTMLButtonAttributes} from 'svelte/elements';
	import type { Snippet } from 'svelte';

    interface Props extends HTMLButtonAttributes {
        variant: 'delete' | 'check';
        icon?:String;
        color?:string;
        className?:string;
        children?: Snippet;
    }
    
    let {variant,color,icon,className,children,...rest}: Props = $props();

</script>

<button class="">
    {#if children}
        {@render children()}
    {/if}
    {#if icon}
        <Icon type={variant}/>
    {/if}
</button>