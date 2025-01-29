<script lang="ts">
    import {goto} from '$app/navigation';
    import {config,user,cohorts} from '$lib/state.svelte';
    import {alert} from '$lib/state.svelte';
   
   
    let updateTable=async(type?:string):Promise<void>=>{
        
          
        if(type==='NC') {
            let i = cohorts.archive.subjects.findIndex(el=>el.yr===cohorts.archive.yrs[cohorts.archive.yIndex].yr && el.nc===cohorts.archive.yrs[cohorts.archive.yIndex].nc);
            cohorts.archive.sIndex = i > -1 ? i : 0;
        }

    
    };
   
    
    
    
    $effect(() => {
        if(config.isReady===false || user.isTeacher===false) goto(`/`);
                
    });
    
    </script>
    
    <svelte:head>
        <title>Archive</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>

    <fieldset>
        <legend>Assessments Vault</legend>
            <span class="spacer">
                <select bind:value={cohorts.archive.yIndex} onchange={()=>updateTable('NC')}>
                    {#each cohorts.archive.yrs as row,index}
                    <option value={index}>{row.yr}/{row.nc}</option>
                    {/each}
                </select>
                </span>
                <span class="spacer">
                <select bind:value={cohorts.archive.sIndex} onchange={()=>updateTable()}>
                    {#each cohorts.archive.subjects as row,index}
                    {#if row.yr===cohorts.archive.yrs[cohorts.archive.yIndex].yr && row.nc===cohorts.archive.yrs[cohorts.archive.yIndex].nc}
                    <option value={index}>{row.sl} ({row.sc}) [{row.yr}/{row.nc}]</option>
                    {/if}
                    {/each}
                </select>
                </span>
        </fieldset>

    <style>

    </style>