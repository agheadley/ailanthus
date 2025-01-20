<script lang="ts">

import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import ExamCohort from '$lib/_ExamCohort.svelte';
import type {ExamTable} from '$lib/_db';
import * as totals from './totals.svelte';
import * as chart from '$lib/chart';
import * as file from '$lib/file';

interface KPI {
    section:string,
    results:{
        yr:number,
        a:{kpi:string,pc:number}[],
        m:{kpi:string,pc:number}[],
        f:{kpi:string,pc:number}[]
    }[]

};

interface Data  {
	menu:{options:string[],index:number},
	raw:any,
	percentage:any,
	kpi:KPI[],
	results:{yr:number,results:ExamTable[]}[]
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
	let out:string[][]=[];

	if(data.menu.options[data.menu.index]==='Raw') {
		let line=[];
		for(const table of data.raw) {
			line.push(`COURSE: ${table.sc}`);
			line.push(`SUBJECT`);
			for(const col of table.totals[0].all) line.push(col.gd);
			line.push('');
			for(const col of table.totals[0].m) line.push(col.gd);
			line.push('');
			for(const col of table.totals[0].f) line.push(col.gd);
			
			out.push(line);
		}

		
	}

	file.csvDownload(out,"EXAM_TOTALS.csv");
	
	

};

let update=async()=>{
    //console.log('HARVESTING RESULTS',`${cohorts.exam.list[cohorts.exam.index].yr}/${cohorts.exam.list[cohorts.exam.index].nc}`);
	
	let yrs:{yr:number,results:ExamTable[]}[] = [0,0,0,0,0].map((el,i)=>({yr:cohorts.exam.list[cohorts.exam.index].yr-i,results:[]}));

	//console.log(data.results);

	// find all with correct nc, excluding 'X' grades, for each year
	for(const yr of yrs) {
			//console.log(yr.yr);
			
			let response = await fetch('/edge/read', {
			method: 'POST',
			body: JSON.stringify({table:"exam_table",select:"*",filter:`gd=neq.X&yr=eq.${yr.yr}&nc=eq.${cohorts.exam.list[cohorts.exam.index].nc}`}),
			headers: {'content-type': 'application/json'}
		});
		yr.results= await response.json();
		console.log(`${yr.yr} FOUND ${yr.results.length ? yr.results.length : 0} RECORD(S)`);
		
	}
	
	

	// only process if iSTotal or isKPI is true - use only results that are valid, 
	// e.g. yr 10 early GCSE results should not be counted in KPIs
	data.raw=totals.getRaw(yrs[0].results.filter(el=>el.isTotal===true));
	data.percentage=totals.getPercentage(yrs[0].results.filter(el=>el.isTotal===true));
	data.kpi=totals.getKPI(yrs.map(el=>({yr:el.yr,results:el.results.filter(el=>el.isKPI===true)})));


	//console.log(data.raw);

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
	

<figure>
{#if data.menu.options[data.menu.index]==='Raw' && data.raw[0]}
	{#each data.raw as table,tableIndex}
	<table class="small">
		<thead>
			<tr>
				<th>COURSE: {table.sc}</th>
				<th>SUBJECT</th>
				<th></th>
				{#each table.totals[0].all as col,colIndex}
					<th>{@html chart.getTotal(false,col.gd)}</th>
				{/each}
				<th></th>
				{#each table.totals[0].m as col,colIndex}
					<th>{@html chart.getTotal(false,col.gd)}</th>
				{/each}
				<th></th>
				{#each table.totals[0].f as col,colIndex}
					<th>{@html chart.getTotal(false,col.gd)}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table.totals as row,rowIndex}
				<tr>
					<td></td>
					<td>{row.sl}</td>
					<td>(all)</td>
					{#each row.all as col,colIndex}
						<td>{@html chart.getTotal(false,col.t)}</td>
					{/each}
					<td>(male)</td>
					{#each row.m as col,colIndex}
						<td>{@html chart.getTotal(false,col.t)}</td>
					{/each}
					<td>(female)</td>
					{#each row.f as col,colIndex}
						<td>{@html chart.getTotal(false,col.t)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<p></p>
	{/each}
{/if}
{#if data.menu.options[data.menu.index]==='Percentage' && data.percentage[0]}
{#each data.percentage as table,tableIndex}
<table class="small">
	<thead>
		<tr>
			<th>COURSE: {table.sc}</th>
			<th>SUBJECT</th>
			<th></th>
			{#each table.totals[0].all as col,colIndex}
				<th>{@html chart.getTotal(false,col.gd)}</th>
			{/each}
			<th></th>
			{#each table.totals[0].m as col,colIndex}
				<th>{@html chart.getTotal(false,col.gd)}</th>
			{/each}
			<th></th>
			{#each table.totals[0].f as col,colIndex}
				<th>{@html chart.getTotal(false,col.gd)}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each table.totals as row,rowIndex}
			<tr>
				<td></td>
				<td>{row.sl}</td>
				<td>(all)</td>
				{#each row.all as col,colIndex}
					<td>{@html chart.getTotal(true,Math.round(col.t))}</td>
				{/each}
				<td>(male)</td>
				{#each row.m as col,colIndex}
					<td>{@html chart.getTotal(true,Math.round(col.t))}</td>
				{/each}
				<td>(female)</td>
				{#each row.f as col,colIndex}
					<td>{@html chart.getTotal(true,Math.round(col.t))}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
<p></p>
{/each}
{/if}
{#if data.menu.options[data.menu.index]==='KPI'}
	{#each data.kpi as table,tableIndex}
		<table class="small">
			<thead>
				<tr>
					<th>{table.section}</th>
					<th></th>
					{#each table.results[0].a as col,colIndex}
							<th>{col.kpi}</th>
					{/each}
					<th></th>
					{#each table.results[0].m as col,colIndex}
						<th>{col.kpi}</th>
					{/each}
					<th></th>
					{#each table.results[0].f as col,colIndex}
						<th>{col.kpi}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each table.results as row,rowIndex}
					<tr>
						<td>{row.yr}</td>
						<td>(all)</td>
						{#each row.a as col,colIndex}
							<td>{@html chart.getTotal(true,Math.round(col.pc))}</td>
						{/each}
						<td>(male)</td>
						{#each row.m as col,colIndex}
						<td>{@html chart.getTotal(true,Math.round(col.pc))}</td>
						{/each}
						<td>(female)</td>
						{#each row.f as col,colIndex}
						<td>{@html chart.getTotal(true,Math.round(col.pc))}</td>
						{/each}
				</tr>
				{/each}
			</tbody>
		</table>
		<p></p>
	{/each}
{/if}
</figure>


<style>


</style>
