<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData } from './$types'
    import { onMount } from 'svelte';
    import {usr,config,cohorts} from '$lib/state.svelte';
	 import * as util from '$lib/util';


    let { data } = $props()
    let { supabase, user } = $derived(data)
  

    const getAdmin=async(email:string):Promise<boolean>=>{
      let  { data, error } = await supabase
          .from('admin_table')
          .select()
          .eq('email', email)
          .limit(1)
          .single()
      
          return data?.email ? true : false;

    };

    const getTeacher=async(tid:string):Promise<boolean>=>{
      let  { data, error } = await supabase
          .from('teacher_table')
          .select()
          .eq('tid', tid)
          .limit(1)
          .single()
      
          return data?.tid ? true : false;

    };

    const getPupil=async(pid:string):Promise<boolean>=>{
      
      if(Number.isNaN(Number(pid))) return false;
      let  { data, error } = await supabase
          .from('pupil_table')
          .select()
          .eq('pid', Number(pid))
          .limit(1)
          .single()
      
          return data?.tid ? true : false;

    };


    
const getCore=async()=>{
	// get all groups
	let response = await fetch('/private/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"group_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	//console.log(res);
	config.groups=res ? res.sort((a: { nc: number; sl: string; sc: string; g: string; },b: { nc: number; sl: any; sc: any; g: any; })=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sc.localeCompare(b.sc) || a.g.localeCompare(b.g)) : [];

	// build cohorts

	cohorts.subject.index=0;
	cohorts.subject.list=util.unique(res,['nc','ss','sc']).map(el=>({yr:Number(el.yr),nc:Number(el.nc),sc:String(el.sc),ss:String(el.ss),sl:String(el.sl)}));
	cohorts.nc.list=util.unique(cohorts.subject.list,['nc']).map(el=>({yr:Number(el.yr),nc:Number(el.nc)}))
	cohorts.nc.index=0;
	//cohorts.academic.yr.list=util.unique(cohorts.academic.sub,['nc']);
	
	//console.log(cohorts);

	


	response = await fetch('/private/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"pupil_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	config.pupils= await response.json();
	//$state.snapshot(config.pupils);
	
	response = await fetch('/private/edge/read', {
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
	cohorts.mySets.index=0;
	cohorts.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

	//find exams
	response = await fetch('/private/api/examCohort', {
		method: 'POST',
		body: JSON.stringify({}),
		headers: {'content-type': 'application/json'}
	});
	cohorts.exam.list= await response.json();



	response = await fetch('/private/api/assessmentCohort', {
		method: 'POST',
		body: JSON.stringify({}),
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
	
};

    onMount(async() => {


		  console.log('private/');
      usr.isAdmin=false;
      usr.isTeacher=false;
      usr.isPupil=false;
      usr.sal='';
      usr.sn='';
      usr.pn='';
      usr.name='';

      console.log('Identifying usr...');

      if(user?.email) {
        
        usr.name=user.email.indexOf('@') > -1 ? String(user.email.split('@')[0].toUpperCase()) : '';

        // testing
        usr.name='DB';

        if(await getPupil(usr.name)) {
          usr.isPupil=true;
          usr.isTeacher=false;
        }

        if(await getTeacher(usr.name)) {
          usr.isPupil=false;
          usr.isTeacher=true;
        }
          
        if(await getAdmin(user.email)) {
          usr.isPupil=false
          usr.isAdmin=true;
          usr.isTeacher=true;
        }

       
      }

      console.log(usr);

      await getCore();
      if(config.isReady && usr.isTeacher) {
        goto(`/private/assessments`);
      } else {
        goto(`/private/pupil`);
      }
		// add auth/etc to chck whether pupil and direct as necessary.




	});



  </script>
  
  <h1>Private page for user: {user?.email}</h1>


  <style>

  </style>