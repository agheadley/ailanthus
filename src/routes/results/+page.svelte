<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import * as chart from '$lib/chart';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';
import * as results from './results.svelte';
import * as file from '$lib/file';

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
	list:any[],
	search:string
};
let data:Data = $state({
    menu:{options:['Table','List'],index:0},
	table:[],
	list:[],
	search:''
});


let download=()=>{
	  let out:string[][]=[];
	  console.log(out);
      file.csvDownload(out,"EXAM_RESULTS.csv");

};

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


<fieldset>
	<legend>Exam Results</legend>
	<ExamCohort></ExamCohort>
	<span>&nbsp;&nbsp;</span>
	<span class="tab">
		{#each data.menu.options as option,index}
		<a href={'javascript:void(0)'} onclick={()=>data.menu.index=index} class={data.menu.index===index ? 'selected' : ''}>{data.menu.options[index]}</a>&nbsp;
		
		{/each}
	</span>
	<span>&nbsp;&nbsp;</span>
	<input type="text" placeholder="pupil name" class={data.search==='' ? `icon-search-bg` : ``} bind:value={data.search}/>
	<span>&nbsp;&nbsp;</span>
	<a data-title="DOWNLOAD" href={'javascript:void(0)'} onclick={download}>{@html icon.download(24)}</a>
	
</fieldset>
	

	

<figure>
{#if data.menu.options[data.menu.index]=='Table' && data.table[0]}
<table class="small">
	<thead>
		<tr>
			<th></th>
			<th></th>
			<th>pid</th>
			<th>sn</th>
			<th>pn</th>
			{#each data.table[0].cols as col,colIndex}
			<th>{@html chart.getAssessmentTitle(col.sl,col.sr!==null ? `${col.sc}/${col.sr}`:`${col.sc}`)}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data.table as row,rowIndex}
			{#if data.search==='' || `${row.pn} ${row.sn}`.toUpperCase().includes(data.search.toUpperCase())}
			<tr>
				<td>{row.yr}</td>
				<td>{row.nc}</td>
				<td>{row.pid}</td>
				<td>{row.sn}</td>
				<td>{row.pn}</td>
				{#each row.cols as col,colIndex}
					<td>{col.gd}</td>
				{/each}
			</tr>
			{/if}
		{/each}
	</tbody>
</table>

{/if}
{#if data.menu.options[data.menu.index]=='List' && data.list[0]}
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
		{#if data.search==='' || `${row.pn} ${row.sn}`.toUpperCase().includes(data.search.toUpperCase())}
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
		{/if}
		{/each}
	</tbody>
</table>


{/if}
</figure>
<style>



</style>
