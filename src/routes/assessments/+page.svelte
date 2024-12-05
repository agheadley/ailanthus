<script lang="ts">
    import * as icon from '$lib/icon';
    import {cohorts,config} from '$lib/state.svelte';
    
    let download=():void=>{
    
    }
    
    let create=async():Promise<void>=>{
    
    }

    let updateTable=(type?:string):void=>{
        
        if(type==='MYSET') {
            console.log('UPDATE ',cohorts.mySets.list[cohorts.mySets.index].g);

            let i = cohorts.nc.list.findIndex(el=>el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.nc.index = i > -1 ? i : 0;

            i = cohorts.subject.list.findIndex(el=>el.sc===cohorts.mySets.list[cohorts.mySets.index].sc && el.ss===cohorts.mySets.list[cohorts.mySets.index].ss && el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
            

        } else {
            console.log('UPDATE ',cohorts.nc.list[cohorts.nc.index].nc,cohorts.subject.list[cohorts.subject.index].sl);
            let i = cohorts.subject.list.findIndex(el=>el.nc===cohorts.nc.list[cohorts.nc.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
        }
    };

    $effect(() => {
        (async () => {
            console.log('assessments/');
            await updateTable('MYSET');
		})()
      
    
    });

    
    </script>
    
    <svelte:head>
        <title>Assessments</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>
    
    
    <section>
        <div class="row">
            <div class="col">
                &nbsp;All&nbsp;
                <select bind:value={cohorts.nc.index} onchange={()=>updateTable()}>
                    {#each cohorts.nc.list as row,index}
                    <option value={index}>{row.nc}</option>
                    {/each}
                </select>
                <select bind:value={cohorts.subject.index} onchange={()=>updateTable()}>
                    {#each cohorts.subject.list as row,index}
                    {#if row.nc===cohorts.nc.list[cohorts.nc.index].nc}
                    <option value={index}>{row.sl} ({row.sc})</option>
                    {/if}
                    {/each}
                </select>
                &nbsp;My sets&nbsp;
                <select bind:value={cohorts.mySets.index} onchange={()=>updateTable('MYSET')}>
                    {#each cohorts.mySets.list as row,index}
                    <option value={index}>{row.g}</option>
                    {/each}
                </select>
                
            </div>
            <div class="col">
                <a title="CREATE" href={'javascript:void(0)'} onclick={create}>{@html icon.plusCircle()}</a>&nbsp;&nbsp;
                <a title="DOWNLOAD" href={'javascript:void(0)'} onclick={download}>{@html icon.download()}</a>&nbsp;&nbsp;
                <a title="ARCHIVE" href={'javascript:void(0)'} onclick={create}>{@html icon.archive()}</a>
            
            
            </div>
    
    
        </div>
    </section>
    

    
    
    <style>
    
    
    </style>
    