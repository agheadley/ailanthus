<script lang="ts">
    import {goto} from '$app/navigation';
    import {config,user,cohorts} from '$lib/state.svelte';
    import {alert} from '$lib/state.svelte';
    import * as assessments from '../assessment.svelte';
    import * as util from '$lib/util';
    import * as chart from '$lib/chart';
    import * as icon from '$lib/icon';
   
    interface TableRow {
        nc?:number,
        sc?:string,
        ss?:string,
        sl?:string,
        g?:string,
        assessments:{id:number,yr:number,nc:number,sc:string,ss:string,sl:string,n:string,dt:number,ds:string,isEdit:boolean,gd:string,r:number}[],
        pupil:{pid:number,sn:string,pn:string,overall:{A:number,B:number}, pre?:{A:number,B:number,sc?:string,ss?:string},results:{gd:string,r:number}[]}[],
        overall?:{A:number,B:number}
    };

    interface Data {
        table:TableRow,
        std:{A:string,B:string}
    }

   
    const data : Data = $state({
        table:{assessments:[],pupil:[]},
        std:{A:'',B:''}
    });

    let updateTable=async(type?:string):Promise<void>=>{
        
          
        if(type==='NC') {
            let i = cohorts.archive.subjects.findIndex(el=>el.yr===cohorts.archive.yrs[cohorts.archive.yIndex].yr && el.nc===cohorts.archive.yrs[cohorts.archive.yIndex].nc);
            cohorts.archive.sIndex = i > -1 ? i : 0;
        }

        let s = cohorts.archive.subjects[cohorts.archive.sIndex];

        data.std=util.getStd( cohorts.archive.subjects[cohorts.archive.sIndex].nc);


        data.table=await assessments.getArchiveTable(s.yr,s.nc,s.sc,s.ss);
       
      



        console.log(data);
    
    };
   
    
    
    
    $effect(() => {
        if(config.isReady===false || user.isTeacher===false) goto(`/`);
        updateTable();
                
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

        {#each data.table.assessments as row}
            <p>{row.id},{row.n},{row.ds}</p>
        {/each}

    <figure>

        <table class="small">
            <thead>
                
                <tr>
                    <th></th>
                  
                    <th> {@html chart.getAssessmentTitle(data.std.A,"Intake")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.B,"Intake")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.A,"Prediction")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.B,"Prediction")}</th>
                    {#each data.table.assessments as col}
                    <th> {@html chart.getAssessmentTitle(col.n,col.ds)}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each data.table.pupil as row}
                    <tr>
                        <td>{row.sn} {row.pn}</td>
                        <td>{@html chart.getIntakeBar(row.overall.A,data.std.A)}</td>
                        <td>{@html chart.getIntakeBar(row.overall.B,data.std.B)}</td>
                    </tr>
                {/each}

            </tbody>



        </table>
    </figure>

    <p>{JSON.stringify(data)}</p>


    <style>

    </style>