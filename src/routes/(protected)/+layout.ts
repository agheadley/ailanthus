import type { LayoutLoad } from './$types'
import {config,cohorts,usr} from '$lib/state.svelte';
import * as util from '$lib/util';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    console.log('+layout.ts');
    
    let r = await fetch(`/auth/user`);
	const user = await r.json();


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
	cohorts.mySets.index=0;
	cohorts.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

	//find exams
	response = await fetch('/api/examCohort', {
		method: 'POST',
		body: JSON.stringify({}),
		headers: {'content-type': 'application/json'}
	});
	cohorts.exam.list= await response.json();



	response = await fetch('/api/assessmentCohort', {
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




    }




	// set isReady flag
	config.isReady = true;

    console.log('harvested core data...');





	return { user, session: data.session };
    
};