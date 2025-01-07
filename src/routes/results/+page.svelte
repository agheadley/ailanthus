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
    (async () => {
        if(!user.isTeacher || config.isReady===false) goto(`/`);
    })()
});



	
</script>

<svelte:head>
	<title>Results</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<div class="row">
	<div class="col">
		<select value={cohorts.exam.index}>
			{#each cohorts.exam.list as row,rowIndex}
				<option value={rowIndex}>{row.yr} NC{row.nc}</option>
			{/each}
		
		</select>
	</div>
	<div class="col">
		<span class="tab">
			<a href={'javascript:void(0)'} onclick={()=>data.menu.index=0} class={data.menu.index===0 ? 'selected' : ''}>Table</a>
    		<a href={'javascript:void(0)'} onclick={()=>data.menu.index=1} class={data.menu.index===1 ? 'selected' : ''}>List</a>

		</span>
	</div>
	<div class="col">
		SEARCH
	</div>
	<div class="col">
		DOWNLOAD
	</div>
	
</div>

<style>



</style>
