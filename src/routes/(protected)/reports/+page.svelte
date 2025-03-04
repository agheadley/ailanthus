<script lang="ts">
    import { goto } from '$app/navigation';
    import * as icon from '$lib/icon';
    import {cohorts,config,usr,alert} from '$lib/state.svelte';
    import Teacher from './Teacher.svelte';
    import { onMount } from 'svelte';

    let status = $state({
        view:{index:0,list:['Teacher','HoD','Enrichment','Tutor','HM','View/Print']},
        isOpen:false,
        cycle:{},
        teachers:[{id:0,mid:'',pn:'',sn:'',sal:'',tid:''}],
        tIndex:0

    });
    
    $effect(() => {  
       
    });
    
    
    onMount(async() => {
		status.cycle={};
        let response = await fetch('/edge/read', {
            method: 'POST',
            body: JSON.stringify({table:'cycle_table',select:'isActive=eq.true',order:'order=id.asc'}),
            headers: {'content-type': 'application/json'}
        });   
        let res= await response.json();
        if(res?.[0]) {
            status.cycle=res[0];
            status.isOpen=true;
            status.teachers=config.teachers.sort((a,b)=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn) );
        }
        //console.log(res);
	});
        
    </script>
    
    <svelte:head>
        <title>Reports</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>
    
    <p>
<span class="tab spacer">
    {#each status.view.list as item,index} 
    <a href={'javascript:void(0)'} onclick={()=>status.view.index=index} class={status.view.index===index ? 'selected' : ''}>{item}</a>&nbsp;&nbsp;
    {/each}
  
</span>
</p>

{#if status.view.list[status.view.index]==='Teacher'}<Teacher status={status}></Teacher>{/if}

    <style>
    
    
    
    </style>
    