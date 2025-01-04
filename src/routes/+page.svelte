<script lang="ts">
import { goto } from '$app/navigation';
import * as icon from '$lib/icon';
import * as util from '$lib/util';
import {user,config,cohorts} from '$lib/state.svelte';


const getCore=async()=>{
	// get all groups
	let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"group_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	//console.log(res);
	config.groups=res ? res.sort((a: { nc: number; sl: string; sc: string; g: string; },b: { nc: number; sl: any; sc: any; g: any; })=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sc.localeCompare(b.sc) || a.g.localeCompare(b.g)) : [];

	// build cohorts

	cohorts.subject.index=0;
	cohorts.subject.list=util.unique(res,['nc','ss','sc']).map(el=>({nc:Number(el.nc),sc:String(el.sc),ss:String(el.ss),sl:String(el.sl)}));
	cohorts.nc.list=util.unique(cohorts.subject.list,['nc']).map(el=>({nc:Number(el.nc)}))
	cohorts.nc.index=0;
	//cohorts.academic.yr.list=util.unique(cohorts.academic.sub,['nc']);
	

	


	response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"pupil_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	config.pupils= await response.json();
	//$state.snapshot(config.pupils);
	
	response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"teacher_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	config.teachers= await response.json();
	//$state.snapshot(config.teachers);

	// identify user
	let f= config.teachers.find(el=>el.tid===user.name);
	user.pn = f ? f.pn : '';
	user.sn = f ? f.sn: '';
	user.sal = f ? f.sal : '';

	// find sets
	let gps = config.groups.flatMap(el=>el.teacher.map(t=>({tid:t.tid,sal:t.sal,g:el.g,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.ss})));
	let g = gps.filter(el=>el.tid===user.name);
	cohorts.mySets.index=0;
	cohorts.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

	// set isReady flag
	config.isReady = true;
	
};


$effect(() => {
  

	(async () => {
		await getCore();
		if(config.isReady) {
			goto(`/assessments`);
		}
		// add auth/etc to chck whether pupil and direct as necessary.
	
	
	})()
	
    
});




</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="ailanthus" />
</svelte:head>


<section>
	{#if config.isReady}
	<blockquote>
		All loaded ...
	</blockquote>
	{:else}
	<blockquote>
		Harvesting core data and obtaining user status ...
	</blockquote>
	{/if}
	

</section>

<p>{user.name}</p>

<p>{JSON.stringify(cohorts)}</p>

<style>


</style>
