<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';
import * as results from './results.svelte';

interface ResultRow{
        pid:number,
        sn:string,
        pn:string,
        yr:number,
        nc:number,
        cols:{sc:string,sl:string,ss:string,sr:string,gd:string}[]
}

interface Data  {
	menu:{options:string[],index:number},
	table:ResultRow[],
	list:any[]
};
let data:Data = $state({
    menu:{options:['Table','List'],index:0},
	table:[],
	list:[]
});

let switchView=(index:number):void=>{
    data.menu.index=index;
}

let update=async()=>{
	console.log('UPDATING RESULTS',`${cohorts.exam.list[cohorts.exam.index].yr}/${cohorts.exam.list[cohorts.exam.index].nc}`);
	let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"exam_table",select:"*",filter:`yr=eq.${cohorts.exam.list[cohorts.exam.index].yr}&nc=eq.${cohorts.exam.list[cohorts.exam.index].nc}`}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	data.table=results.getResultsTable(res);

	data.list=res.sort((a: { sn: string; pn: string; sc: string; sl: string; ss: string; sr: string; },b: { sn: any; pn: any; sc: any; sl: any; ss: any; sr: any; })=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn) || a.sc.localeCompare(b.sc) || a.sl.localeCompare(b.sl) || a.ss.localeCompare(b.ss) || a.sr.localeCompare(b.sr));		
	

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
			{#each data.menu.options as option,index}
			<a href={'javascript:void(0)'} onclick={()=>data.menu.index=index} class={data.menu.index===index ? 'selected' : ''}>{data.menu.options[index]}</a>&nbsp;
    		
			{/each}
			
		</span>
	</div>
	<div class="col">
		SEARCH
	</div>
	<div class="col">
		DOWNLOAD
	</div>
	
</div>

{#if data.menu.options[data.menu.index]=='Table'}

Table
{/if}
{#if data.menu.options[data.menu.index]=='List'}
<table class="small">
	<thead>
		<tr>
			<th></th>
			<th></th>
			<th>pid</th>
			<th>sn</th>
			<th>pn</th>
			<th>course</th>
			<th>subject</th>
			<th></th>
			<th>code</th>
			<th>grade</th>
			<th>note</th>
		</tr>
	</thead>
	<tbody>
		{#each data.list as row,index}
		<tr>
			<td>{row.yr}</td>
			<td>{row.nc}</td>
			<td>{row.pid}</td>
			<td>{row.sn}</td>
			<td>{row.pn}</td>
			<td>{row.sc}</td>
			<td>{row.sl}</td>
			<td>{row.ss}</td>
			<td>{row.sr}</td>
			<td>{row.gd}</td>
			<td>{row.log}</td>
			
		</tr>
		{/each}
	</tbody>
</table>


{/if}
<style>



</style>
