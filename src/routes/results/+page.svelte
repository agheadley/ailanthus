<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';

let data = $state({
    menu:{options:['table','list'],index:0}

});

let switchView=(index:number):void=>{
    data.menu.index=index;
}

let update=()=>{
	console.log(cohorts.exam.index);
};

$effect(() => {  
    
        if(!user.isTeacher || config.isReady===false) goto(`/`);

		update();


   
});



	
</script>

<svelte:head>
	<title>Results</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<div class="row">
	<div class="col">
		<ExamCohort></ExamCohort>
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

<p>{cohorts.exam.index}</p>
<style>



</style>
