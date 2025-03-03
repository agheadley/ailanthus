<script lang="ts">
    import { goto } from '$app/navigation';
    import * as icon from '$lib/icon';
    import {cohorts,config,usr,alert} from '$lib/state.svelte';
    import Teacher from './Teacher.svelte';

    let status = $state({
        view:{index:0,list:['Teacher','HoD','Enrichment','Tutor','HM','View/Print']},


    });
    
    $effect(() => {  
       
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

{#if status.view.list[status.view.index]==='Teacher'}<Teacher></Teacher>{/if}

    <style>
    
    
    
    </style>
    