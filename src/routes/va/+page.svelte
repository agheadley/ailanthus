<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';

$effect(() => {  
    (async () => {
        if(!user.isTeacher || config.isReady===false) goto(`/`);
    })()
});


</script>

<svelte:head>
	<title>VA</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<p>VA</p>

<style>


</style>
