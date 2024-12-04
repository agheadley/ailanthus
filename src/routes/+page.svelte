<script lang="ts">
import * as icon from '$lib/icon';
import * as util from '$lib/util';
import {user,config,cohorts} from '$lib/state.svelte';


const getCore=async()=>{
	let response = await fetch('/api/read', {
		method: 'POST',
		body: JSON.stringify({table:"group_table"}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log(res);
	config.groups=res ? res.sort((a: { nc: number; sl: { localeCompare: (arg0: any) => any; }; sc: { localeCompare: (arg0: any) => any; }; },b: { nc: number; sl: any; sc: any; })=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sc.localeCompare(b.sc) ) : [];

	//groups=res;

	cohorts.subject.index=0;
	cohorts.subject.list=util.unique(res,['nc','ss','sc']).map(el=>({nc:Number(el.nc),sc:String(el.sc),ss:String(el.ss),sl:String(el.sl)}));
	cohorts.nc.list=util.unique(cohorts.subject.list,['nc']).map(el=>({nc:Number(el.nc)}))
	cohorts.nc.index=0;
	//cohorts.academic.yr.list=util.unique(cohorts.academic.sub,['nc']);
	

	config.isReady = true;

	let gps = config.groups.flatMap(el=>el.teacher.map(t=>({tid:t.tid,sal:t.sal,g:el.g,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.ss})));
	let f=gps.filter(el=>el.tid===user.name);
	user.sal = f[0] ? f[0].sal : '';

	cohorts.mySets.index=0;
	cohorts.mySets.list=f[0] ? f.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

	
};


$effect(() => {
  
	getCore();
	
    
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
