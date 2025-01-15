<script lang="ts">

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
		hse:string,
		gnd:string,
        cols:{sc:string,sl:string,ss:string,sr:string,gd:string}[],
		totals:{sc:string,gd:string,t:number}[]
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
	
	if(data.menu.options[data.menu.index]=='Table' && data.table[0]) {

		let scs = [ ... new Set(data.list.map(el=>el.sc))];
		console.log(scs);
		let gds=config.grade.filter(el=>scs.includes(el.sc)).sort((a,b)=>a.sc.localeCompare(b.sc) ||b.pc-a.pc).map(el=>({sc:el.sc,gd:el.gd}));
		console.log(gds);


		out[0]=['yr','nc','pid','sn','pn','gnd','hse'];
		for(const el of data.table[0].cols) out[0].push(el.sr!==null ? `${el.ss}/${el.sc}/${el.sr}` : `${el.ss}/${el.sc}`)
		out[0].push('TOTALS');
		out[0]=out[0].concat(gds.map(el=>`${el.gd}/${el.sc}`));
		for(const row of data.table) {
			if(data.search==='' || `${row.pn} ${row.sn}`.toUpperCase().includes(data.search.toUpperCase())) {
				let line=[String(row.yr),String(row.nc),String(row.pid),row.sn,row.pn,row.gnd,row.hse];
				for(const el of row.cols) line.push(el.gd);
				line.push('');
				let ts=results.getTotals(row.cols,gds);
				line=line.concat(ts.map(el=>String(el.t)));
				out.push(line);
			}
		}
	} else if(data.menu.options[data.menu.index]=='List' && data.table[0]) {
		out[0]=['yr','nc','pid','sn','pn','gnd','hse','sc','sl','ss','sr','gd','log'];
		for(const row of data.list) {
			if(data.search==='' || `${row.pn} ${row.sn}`.toUpperCase().includes(data.search.toUpperCase())) {
				out.push([String(row.yr),String(row.nc),String(row.pid),row.sn,row.pn,row.gnd,row.hse,row.sc,row.sl,row.ss,row.sr,row.gd,row.log!==null ? row.log : '']);
			}
		}
	}

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
	console.log(`FOUND ${res.length ? res.length : 0} RECORD(S)`);
	data.table=results.getResultsTable(res);

	//console.log(data.table);

	data.list=res.sort((a: { sn: string; pn: string; sc: string; sl: string; ss: string; sr: string; },b: { sn: any; pn: any; sc: any; sl: any; ss: any; sr: any; })=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn) || a.sc.localeCompare(b.sc) || a.sl.localeCompare(b.sl) || a.ss.localeCompare(b.ss) || a.sr.localeCompare(b.sr));		
	

};

$effect(() => {  
    
      

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
			<th>gnd</th>
			<th>hse</th>
			{#each data.table[0].cols as col,colIndex}
			<th>{@html chart.getAssessmentTitle(col.sl,col.sr!==null ? `${col.sc}/${col.sr}`:`${col.sc}`)}</th>
			{/each}
			<th>TOTALS</th>
			{#each data.table[0].totals as col,colIndex}
				<th>{`${col.gd}/${col.sc}`}</th>
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
				<td>{row.gnd}</td>
				<td>{row.hse}</td>
				{#each row.cols as col,colIndex}
					<td>{col.gd}</td>
				{/each}
				<td></td>
				{#each row.totals as col,colIndex}
				<td>{col.t}</td>
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
			<th>gnd</th>
			<th>hse</th>
			<th>sc</th>
			<th>sl</th>
			<th>ss</th>
			<th>sr</th>
			<th>gd</th>
			<th>log</th>
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
			<td>{row.gnd}</td>
				
			<td>{row.hse}</td>
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
