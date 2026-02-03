<script lang="ts">
    import type {HTMLButtonAttributes} from 'svelte/elements';
    import Icon from '$lib/components/Icon.svelte';
    interface Props extends HTMLButtonAttributes {
        variant: 'delete' | 'check';
    }

    let {variant,...rest}: Props = $props();

</script>

<button data-variant={variant} type="submit" class="{variant === 'check' ? 'border border-dark w-4 h-4 ' : ''}" {...rest}>
    <Icon type={variant} />
</button>



