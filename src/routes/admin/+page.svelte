<script lang="ts">
import {goto} from '$app/navigation';
import {config,user} from '$lib/state.svelte';

$effect(() => {
    if(config.isReady===false || user.isAdmin===false) goto(`/`);
            
});

</script>

<svelte:head>
    <title>Admin</title>
    <meta name="description" content="ailanthus" />
</svelte:head>

<style>

</style>