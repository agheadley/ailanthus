<script lang="ts">
    import * as icon from '$lib/icon';
    import * as chart from '$lib/chart';
    import {cohorts,config} from '$lib/state.svelte';
    import * as process from './process.svelte';
    import Modal from '$lib/_Modal.svelte';
    import Create from './Create.svelte';

    let data : any = $state({
        table:[],
        std:{A:'',B:''},
        subject:{sc:'',ss:'',sl:'',nc:0},
        isCreate:false

    });

    let download=():void=>{
    
    }
    
    let create=async():Promise<void>=>{
        data.isCreate=true;
    }

    let updateTable=(type?:string):void=>{
        
       
        if(type==='MYSET') {
            console.log('UPDATE ',cohorts.mySets.list[cohorts.mySets.index].g);

            let i = cohorts.nc.list.findIndex(el=>el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.nc.index = i > -1 ? i : 0;

            i = cohorts.subject.list.findIndex(el=>el.sc===cohorts.mySets.list[cohorts.mySets.index].sc && el.ss===cohorts.mySets.list[cohorts.mySets.index].ss && el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
            

        } else if(type==='NC') {
            console.log('UPDATE ',cohorts.nc.list[cohorts.nc.index].nc,cohorts.subject.list[cohorts.subject.index].sl);
            let i = cohorts.subject.list.findIndex(el=>el.nc===cohorts.nc.list[cohorts.nc.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
        }

        data.table = process.getTable(cohorts.subject.list[cohorts.subject.index].nc,cohorts.subject.list[cohorts.subject.index].sc,cohorts.subject.list[cohorts.subject.index].ss); 
     
        data.std=process.getStd( cohorts.nc.list[ cohorts.nc.index].nc);
        //$state.snapshot(data.table);

        data.subject.nc=cohorts.nc.list[cohorts.nc.index].nc;
        data.subject.sc=cohorts.subject.list[cohorts.subject.index].sc;
        data.subject.ss=cohorts.subject.list[cohorts.subject.index].ss;
        data.subject.sl=cohorts.subject.list[cohorts.subject.index].sl;

    };

    // first load
    updateTable('MYSET');
   

    
    </script>
    
    <svelte:head>
        <title>Assessments</title>
        <meta name="description" content="ailanthus" />
    </svelte:head>
    
    
    {#if data.isCreate}
    <Modal bind:open={data.isCreate} title={'Create Assessment'}>
        {#snippet children()}
		<Create bind:data={data}></Create> 
	{/snippet}
    </Modal>
    {/if}


        <div class="row">
            <div class="col">
             
              
                Cohorts&nbsp;
                <select bind:value={cohorts.nc.index} onchange={()=>updateTable('NC')}>
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
    
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>{data.std.A}</th>
                    <th>{data.std.B}</th>
                </tr>
            </thead>
            <tbody>
                {#each data.table as group,groupIndex}
                    {#each group.pupil as row,rowIndex}
                        <tr>
                            <td>
                                <div class="w10">{row.sn} {row.pn}</div>
                            </td>
                            <td>{group.g}</td>
                            <td>{@html chart.getIntakeBar(row.overall.A,data.std.A)}</td>
                            <td>{@html chart.getIntakeBar(row.overall.B,data.std.B)}</td>
                        </tr>
                    {/each}
                {/each}
            </tbody>
        </table>
    
    
    <style>
    
        .w10 {
            max-width:10rem;
            word-wrap: break-word;
            white-space: nowrap;
            overflow:hidden;
          
            
        }

        table {
            font-size:0.8rem;
        }


    
    </style>
    