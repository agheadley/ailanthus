<script lang="ts">

import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';


const update=async()=>{
	//data.kResults=res.filter((el: { isVA: boolean; })=>el.isVA===true);

};

$effect(() => {  
   update();
});


</script>

<svelte:head>
	<title>VA</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<p>VA</p>

<style>


</style>
