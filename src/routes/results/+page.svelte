<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';

let data = $state({
    menu:{options:['table','list'],index:0}
});

let switchView=(index:number):void=>{
    data.menu.index=index;
}

$effect(() => {
            console.log('data update');
            //$inspect(data.isUpdateRequired);
            (async () => {
                if(config.isReady===false) goto(`/`);
		    })()
	});

</script>

<svelte:head>
	<title>Results</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<p class='tab'>
    <a href={'javascript:void(0)'} onclick={()=>data.menu.index=0} class={data.menu.index===0 ? 'selected' : ''}>Table</a>
    <a href={'javascript:void(0)'} onclick={()=>data.menu.index=1} class={data.menu.index===1 ? 'selected' : ''}>List</a>
</p>
<style>



</style>
