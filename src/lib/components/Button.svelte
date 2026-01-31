<script lang="ts">
    import type {HTMLButtonAttributes} from 'svelte/elements';
    import Icon from '$lib/components/Icon.svelte';
    interface Props extends HTMLButtonAttributes {
        variant: 'delete';
    }

    let {variant,...rest}: Props = $props();

</script>

<button data-variant={variant} type="submit" {...rest}>
    <Icon type={variant} />
</button>



