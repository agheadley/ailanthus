<script lang="ts">
    import { goto } from '$app/navigation';
    import * as icon from '$lib/icon';
    import {cohorts,config,usr,alert} from '$lib/state.svelte';
    
   
    
    $effect(() => {  
        (async () => {
            if(!usr.isTeacher || config.isReady===false) goto(`/`);
        })()
    });
    
    
    
        
    </script>
    
    <svelte:head>
        <title>Overview</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>
    
    <p>Overview</p>

    

    <style>
    
    
    
    </style>
    