<script lang="ts">
    import {config,alert,usr} from '$lib/state.svelte'

let { status = $bindable() , ...props} = $props();
import { onMount } from 'svelte';


const updateTeacher=async()=>{
    
    //console.log(status.teachers.list);
    let gps = config.groups.flatMap(el=>el.teacher.map(t=>({tid:t.tid,sal:t.sal,g:el.g,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.sl})));
    //console.log(gps);
	let g = gps.filter(el=>el.tid===status.teachers.list[status.teachers.index].tid);
	//console.log(g);
	status.mySets.index=0;
	status.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

    console.log('mysets');
    await updateReports();
};

const updateReports=async()=>{
    console.log('updateReports');
    /*
    let response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:'report_table',select:`tid=eq.${status.teachers.list[status.teachers.index].tid} and nc=eq.${status.mySets.list[status.mySets.index].nc} and sc=eq.${status.mySets.list[status.mySets.index].sc} and sl=eq.${status.mySets.list[status.mySets.index].sl} and g=eq.${status.mySets.list[status.mySets.index].g}`,order:'order=id.asc'}),
        headers: {'content-type': 'application/json'}
    });   
    let res= await response.json();
    console.log(res);
    if(res?.[0]) {
        status.mySets.list[status.mySets.index].ss=res[0].ss;
    }
    //console.log(res);
    */
};

onMount(async() => {  
    console.log('Teacher.svelte mounted...');  
    //console.log(status.cycle);
    //console.log(status.teachers);
    await updateTeacher();
});

</script>


{#if status.isOpen}
    <fieldset>
        <legend>Teacher Reports</legend>
        {status.cycle.yr} {status.cycle.period.term} {status.cycle.period.session}
        <select bind:value={status.teachers.index} {...props} onchange={()=>updateTeacher()}>
            {#each status.teachers.list as row,index}
           
            <option value={index}>{row.sn} {row.pn} ({row.tid})</option>
           
            {/each}
        </select>
        <select bind:value={status.mySets.index} {...props} onchange={()=>updateReports()}>
            {#each status.mySets.list as row,index}
           
            <option value={index}>{row.nc} {row.sc} {row.sl} {row.g}</option>
           
            {/each}
        </select>
    </fieldset>
{:else}
    <p class="notice">No active report cycle.</p>
{/if}


<style>

</style>