<script lang="ts">

import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';
import type {ExamTable} from '$lib/_db';
import * as totals from './totals.svelte';

interface Data  {
	menu:{options:string[],index:number},
	raw:any,
	percentage:any,
	kpi:any,
	results:ExamTable[]
};
let data:Data = $state({
    menu:{options:['Raw','Percentage','KPI'],index:0},
	table:[],
	results:[],
	raw:[],
	percentage:[],
	kpi:[]
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
	data.results= await response.json();
	console.log(`FOUND ${data.results.length ? data.results.length : 0} RECORD(S)`);
	
	data.raw=totals.getRaw(data.results.filter(el=>el.isTotal===true));
	data.percentage=totals.getPercentage(data.results.filter(el=>el.isTotal===true));
	data.kpi=totals.getKPI(data.results.filter(el=>el.isKPI===true));

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
