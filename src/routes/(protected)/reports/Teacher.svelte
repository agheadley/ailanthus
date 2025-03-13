<script lang="ts">
    import {config,alert,usr} from '$lib/state.svelte'

let { status = $bindable() } = $props();
import { onMount } from 'svelte';


const updateTeacher=()=>{
    
    let gps = config.groups.flatMap(el=>el.teacher.map(t=>({tid:t.tid,sal:t.sal,g:el.g,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.sl})));
	let g = gps.filter(el=>el.tid===status.teachers.list[status.teachers.index].tid);
	console.log(g);
	status.mySets.index=0;
	status.mySets.list=g[0] ? g.map(el=>({nc:el.nc,g:el.g,sc:el.sc,sl:el.sl,ss:el.ss})).sort((a,b)=>b.nc-a.nc || a.sl.localeCompare(b.sl) || a.sl.localeCompare(b.sc)) : [];

    
};

const updateReports=async()=>{

};


const setup=async()=>{
    console.log(status.teachers);
    updateTeacher();
    await updateReports();
    

};


onMount(() => {  
    console.log('Teacher.svelte mounted...');  
    console.log(status.cycle);
    setup();
});

</script>


{#if status.isOpen}
    <fieldset>
        <legend>Teacher Reports</legend>
        {status.cycle.yr} {status.cycle.period.term} {status.cycle.period.session}
        <select bind:value={status.teachers.index} onchange={()=>updateTeacher()}>
            {#each status.teachers.list as row,index}
           
            <option value={index}>{row.sn} {row.pn} ({row.tid})</option>
           
            {/each}
        </select>
        <select bind:value={status.mySets.index} onchange={()=>updateReports()}>
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