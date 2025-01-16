<script lang="ts">

import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';
import type {ExamTable} from '$lib/_db';
import * as totals from './totals';

interface Data  {
	menu:{options:string[],index:number},
	table:any,
	tResults:ExamTable[],
	kResults:ExamTable[],
};
let data:Data = $state({
    menu:{options:['Raw','Percentage','KPI'],index:0},
	table:[],
	tResults:[],
	kResults:[]
});

let download=()=>{

};

let update=async()=>{
    console.log('HARVESTING RESULTS',`${cohorts.exam.list[cohorts.exam.index].yr}/${cohorts.exam.list[cohorts.exam.index].nc}`);
	let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"exam_table",select:"*",filter:`yr=eq.${cohorts.exam.list[cohorts.exam.index].yr}&nc=eq.${cohorts.exam.list[cohorts.exam.index].nc}`}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log(`FOUND ${res.length ? res.length : 0} RECORD(S)`);
	data.tResults=res.filter((el: { isTotal: boolean; })=>el.isTotal===true);
	data.kResults=res.filter((el: { isKPI: boolean; })=>el.isKPI===true);

};

$effect(() => {  
   
    update();
});

</script>

<svelte:head>
	<title>Totals</title>
	<meta name="description" content="ailanthus" />
</svelte:head>


<fieldset>
	<legend>Exam Totals & KPIs</legend>
	<span  class="spacer">
	<ExamCohort></ExamCohort>
	</span>
	<span class="tab spacer">
		{#each data.menu.options as option,index}
		<a href={'javascript:void(0)'} onclick={()=>data.menu.index=index} class={data.menu.index===index ? 'selected' : ''}>{data.menu.options[index]}</a>&nbsp;
		
		{/each}
	</span>
	<span  class="spacer">
	<a data-title="DOWNLOAD" href={'javascript:void(0)'} onclick={download}>{@html icon.download(24)}</a>
	</span>
</fieldset>
	



<style>


</style>
