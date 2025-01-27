<script lang="ts">

import * as icon from '$lib/icon';
import * as chart from '$lib/chart';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import type {ExamTable} from '$lib/_db';
import ExamCohort from '$lib/_ExamCohort.svelte';
import * as va from './va.svelte';

interface Data  {
	menu:{options:string[],index:number},
	standards:{options:{key:string,txt:string}[],index:number},
	overall:any,
	groups:any,
	intake:any
};
let data:Data = $state({
    menu:{options:['Overall','Group','Intake'],index:0},
	standards:{options:[{key:'A',txt:''},{key:'B',txt:''}],index:0},
	overall:[],
	groups:[],
	intake:[]
	
});

const download=()=>{

};

const getStandards=()=>{
	let f=config.std.find(el=>el.nc===cohorts.exam.list[cohorts.exam.index].nc);
	//console.log(f);
	data.standards.options[0].txt = f ? f.A : data.standards.options[0].key;
	data.standards.options[1].txt = f ? f.B : data.standards.options[1].key;
	

};

const update=async()=>{

	

	let yrs:{yr:number,results:ExamTable[]}[] = [0,0,0,0,0].map((el,i)=>({yr:cohorts.exam.list[cohorts.exam.index].yr-i,results:[]}));

	//console.log(yrs);

	// find all with correct nc, excluding 'X' grades, for each year
	for(const yr of yrs) {
			//console.log(yr.yr);
			
			let response = await fetch('/edge/read', {
			method: 'POST',
			body: JSON.stringify({table:"exam_table",select:"*",filter:`gd=neq.X&yr=eq.${yr.yr}&nc=eq.${cohorts.exam.list[cohorts.exam.index].nc}&isVA=eq.true`}),
			headers: {'content-type': 'application/json'}
		});
		yr.results= await response.json();
		console.log(`${yr.yr} FOUND ${yr.results.length ? yr.results.length : 0} RECORD(S)`);
		
	}
	console.log('********************');


	const response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:"intake_table",select:"*",filter:`yr=eq.${cohorts.exam.list[cohorts.exam.index].yr}&nc=eq.${cohorts.exam.list[cohorts.exam.index].nc}`}),
        headers: {'content-type': 'application/json'}
    });
    const i= await response.json();
	console.log(i);

	data.groups=va.getGroups(yrs[0].results);
	data.intake=va.getIntake(yrs[0].results,i);
	// run overall last, as it resorts data yr asc, groups,intake need to take latest year
	data.overall = va.getOverall(yrs);
	//console.log(data.intake);
	
	//console.log(data.overall);

};

$effect(() => { 
	getStandards(); 
   	update();

});


</script>

<svelte:head>
	<title>VA</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<fieldset>
	<legend>Exam Value Added</legend>
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
	<span class="spacer tab">
		Std Residual&nbsp;
		{#each data.standards.options as option,index}
		<a href={'javascript:void(0)'} onclick={()=>data.standards.index=index} class={data.standards.index===index ? 'selected' : ''}>{data.standards.options[index].txt}</a>&nbsp;
		{/each}
	</span>
</fieldset>


<figure>
	
	{#if data.overall[0] && data.menu.options[data.menu.index]==='Overall'}
	<table class="small">		
		<tbody>
			{#each data.overall as row,rowIndex}
				{#if rowIndex===0 || (rowIndex>0 && row.sc !==data.overall[rowIndex-1].sc)}
				<tr>
					<th>COURSE</th>
					<th>SUBJECT</th>
					<th></th>
					{#each row.all as col,colIndex}
					<th>{col.yr}</th>
					{/each}
					<th></th>
					{#each row.m as col,colIndex}
					<th>{col.yr}</th>
						{/each}
					<th></th>
					{#each row.f as col,colIndex}
					<th>{col.yr}</th>
					{/each}
				</tr>
		
				{/if}

				<tr>
					<th>{row.sc}</th>
					<th>{row.sl}</th>
					<th>(all)</th>
					{#each row.all as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
					<th>(male)</th>
					{#each row.m as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
					<th>(female)</th>
					{#each row.f as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	

	{/if} 	<!-- /end of Overall-->


	{#if data.groups[0] && data.menu.options[data.menu.index]==='Group'}
	<table class="small">		
		<tbody>
			{#each data.groups as row,rowIndex}
				

				<tr>
					<th>{row.sc}</th>
					<th>{row.sl}</th>
					{#each row.g as col,colIndex}
						<th>{col.g}</th>
					{/each}
				</tr>
				<tr>
					<th>Group VA</th>
					<th></th>
					{#each row.g as col,colIndex}
						<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
				</tr>
				<tr>
					<th>Same pupils</th>
					<th>(Other subjects)</th>
					{#each row.g as col,colIndex}
						<th>{@html chart.getVA(col[`cf${data.standards.options[data.standards.index].key}`])}</th>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	

	{/if} <!-- /end of Group-->


	{#if data.intake[0] && data.menu.options[data.menu.index]==='Intake'}
	<table class="small">		
		<tbody>
			{#each data.intake as row,rowIndex}
				{#if rowIndex===0 || (rowIndex>0 && row.sc !==data.overall[rowIndex-1].sc)}
				<tr>
					<th>COURSE</th>
					<th>SUBJECT</th>
					<th></th>
					{#each row.all as col,colIndex}
					<th>{col.band}</th>
					{/each}
					<th></th>
					{#each row.m as col,colIndex}
					<th>{col.band}</th>
						{/each}
					<th></th>
					{#each row.f as col,colIndex}
					<th>{col.band}</th>
					{/each}
				</tr>
		
				{/if}
				<tr>
					<th>{row.sc}</th>
					<th>{row.sl}</th>
					<th>(all)</th>
					{#each row.all as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
					<th>(m)</th>
					{#each row.m as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
					<th>(f)</th>
					{#each row.f as col,colIndex}
					<th>{@html chart.getVA(col[data.standards.options[data.standards.index].key])}</th>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	{/if} <!-- /end of Intake-->


</figure>

<style>


</style>
