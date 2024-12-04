<script lang="ts">
    import * as icon from '$lib/icon';
    import {cohorts,config} from '$lib/state.svelte';
    
    let download=():void=>{
    
    }
    
    let create=async():Promise<void>=>{
    
    }
    
    </script>
    
    <svelte:head>
        <title>Assessments</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>
    
    
    <section>
        <div class="row">
            <div class="col">
                <select>
                    {#each cohorts.nc.list as row,index}
                    <option>{row.nc}</option>
                    {/each}
                </select>
                <select>
                    {#each cohorts.subject.list as row,index}
                    <option>{row.sl} ({row.sc})</option>
                    {/each}
                </select>
            </div>
            <div class="col">
                <select>
                    {#each cohorts.mySets.list as row,index}
                    <option>{row.g}</option>
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
    