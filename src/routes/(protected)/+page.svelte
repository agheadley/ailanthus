<script lang="ts">
import {config,cohorts,usr} from '$lib/state.svelte';
import * as util from '$lib/util';
import {goto} from '$app/navigation';

let { data } = $props();
let { user } = $derived(data);

const getUser=async()=>{

	console.log('looking for usr...');
	//console.log(user);

	if(!Number.isNaN(Number(usr.name))) {
		let response = await fetch('/edge/read', {
			method: 'POST',
			body: JSON.stringify({table:"pupil_table",select:"*",filter:`pid=eq.${Number(usr.name)}`}),
			headers: {'content-type': 'application/json'}
		});
		let res=await response.json();
		console.log(res);
		if(res?.[0]) {
			usr.isAdmin=false;
			usr.isTeacher=false;
			usr.isPupil=true;
		}
	}

	let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"teacher_table",select:"*",filter:`tid=eq.${usr.name}`}),
		headers: {'content-type': 'application/json'}
	});
	let res=await response.json();
	if(res?.[0]) {
		usr.isAdmin=false;
		usr.isTeacher=true;
		usr.isPupil=false;

	}
	
	

	response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"admin_table",select:"*",filter:`email=eq.${user.email}`}),
		headers: {'content-type': 'application/json'}
	});
	res=await response.json();
	if(res?.[0]) {
		usr.isAdmin=true;
		usr.isTeacher=true;
		usr.isPupil=false;

	}


	
};

const getConfig=async()=>{
	
    let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"group_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	config.groups=res ? res.sort((a: { nc: number; sl: string; sc: string; g: string; },b: { nc: number; sl: any; sc: any; g: any; })=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sc.localeCompare(b.sc) || a.g.localeCompare(b.g)) : [];

    cohorts.subject.index=0;
	cohorts.subject.list=util.unique(res,['nc','ss','sc']).map(el=>({yr:Number(el.yr),nc:Number(el.nc),sc:String(el.sc),ss:String(el.ss),sl:String(el.sl)}));
	cohorts.nc.list=util.unique(cohorts.subject.list,['nc']).map(el=>({yr:Number(el.yr),nc:Number(el.nc)}))
	cohorts.nc.index=0;

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

	// identify usr
	let f= config.teachers.find(el=>el.tid===usr.name);
	usr.pn = f ? f.pn : '';
	usr.sn = f ? f.sn: '';
	usr.sal = f ? f.sal : '';

	// find sets

	let gps = config.groups.flatMap(el=>el.teacher.map(t=>({tid:t.tid,sal:t.sal,g:el.g,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.ss})));
	let g = gps.filter(el=>el.tid===usr.name);
	console.log(g);
	cohorts.mySets.index=0;
	cohorts.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

	//find exams
	/*
	response = await fetch('/api/examCohort', {
		method: 'POST',
		body: JSON.stringify({}),
		headers: {'content-type': 'application/json'}
	});
	*/
	response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"exam_cohorts_view",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	cohorts.exam.list= await response.json();


	/*
	response = await fetch('/api/assessmentCohort', {
		method: 'POST',
		body: JSON.stringify({}),
		headers: {'content-type': 'application/json'}
	});
	*/
	response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"assessments_cohorts_view",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	res= await response.json();
	cohorts.archive.subjects=res ? res : [];
	cohorts.archive.yrs=util.unique(res,['yr','nc'])
		.map(el=>({yr:Number(el.yr),nc:Number(el.nc)}))
		.sort((a,b)=>b.yr-a.yr || b.nc-a.nc);
	cohorts.archive.yIndex=0;
	cohorts.archive.sIndex=0;
	


  




	// set isReady flag
	config.isReady = true;

    console.log('harvested core data...');

	
};


$effect(()=>{
	usr.name='';
	usr.isAdmin=false;
	usr.isTeacher=false;
	usr.isPupil=false;
	
	if(user?.email) {
        
        usr.name=user.email.indexOf('@') > -1 ? String(user.email.split('@')[0].toUpperCase()) : '';
		
		//testing
		usr.name='DB';

		getConfig().then(()=>{
			getUser().then(()=>{
				if(config.isReady && usr.isTeacher) {
					goto(`/assessments`);
				} else {
					goto(`/pupil`);
				}
			});

		});
	} 
});

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if !usr.name && !config.isReady}
	<p class="notice">Building application data. Please wait ...</p>
	{:else if !usr.name && config.isReady}
	<p class="notice">User not found in the database ...</p>
	{:else}
	<p class="notice">Starting application...</p>
	{/if}

</section>



<p></p>
<style>
</style>
