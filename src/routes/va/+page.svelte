<script lang="ts">

import * as icon from '$lib/icon';
import {cohorts,config,user,alert} from '$lib/state.svelte';
import type {ExamTable} from '$lib/_db';
import ExamCohort from '$lib/_ExamCohort.svelte';

interface Data  {
	menu:{options:string[],index:number},
	standards:{options:{key:string,txt:string}[],index:number},
	results:{yr:number,results:ExamTable[]}[]
};
let data:Data = $state({
    menu:{options:['Overall','Group','Intake'],index:0},
	standards:{options:[{key:'stdResA',txt:''},{key:'stdResB',txt:''}],index:0},
	results:[]
	
});

const download=()=>{

};

const getStandards=()=>{
	let f=config.std.find(el=>el.nc===cohorts.exam.list[cohorts.exam.index].nc);
	console.log(f);
	data.standards.options[0].txt = f ? f.A : data.standards.options[0].key;
	data.standards.options[1].txt = f ? f.B : data.standards.options[1].key;
	

};

const update=async()=>{

	

	let yrs:{yr:number,results:ExamTable[]}[] = [0,0,0,0,0].map((el,i)=>({yr:cohorts.exam.list[cohorts.exam.index].yr-i,results:[]}));

	//console.log(data.results);

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
	



</figure>

<style>


</style>
