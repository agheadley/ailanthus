<script lang="ts">
    import {config,alert,usr} from '$lib/state.svelte'

let { status } = $props();


const updateTeacher=()=>{

};


const setup=async()=>{
    console.log(status.teachers);

};


$effect(() => {  
    console.log('Teacher.svelte mounted...');  
    console.log(status.cycle);
    setup();
});

</script>


{#if status.isOpen}
    <fieldset>
        <legend>Teacher Reports</legend>
        {status.cycle.yr} {status.cycle.period.term} {status.cycle.period.session}
        <select bind:value={status.tIndex} onchange={()=>updateTeacher()}>
            {#each status.teachers as row,index}
           
            <option value={index}>{row.sn} {row.pn} ({row.tid})</option>
           
            {/each}
        </select>
    </fieldset>
{:else}
    <p class="notice">No active report cycle.</p>
{/if}


<style>

</style>