<script lang="ts">
    import type {HTMLButtonAttributes} from 'svelte/elements';
    import type {Snippet} from 'svelte';
    import Icon from '$lib/componentsAdmin/Icon.svelte';
    interface Props extends HTMLButtonAttributes {
        variant: 'delete' | 'check';
        color?:string;
        classButton?:string;
        children?: Snippet;
    }

    let {variant,color,classButton,children,...rest}: Props = $props();

</script>

<button data-variant={variant} type="submit" class="{color ?? 'text-dark '} {variant === 'check' ? 'w-8 h-8 ' : ''} {classButton}" {...rest}>
    {#if children}
        {@render children()}
    {:else}
        <Icon type={variant} />
    {/if}
</button>



