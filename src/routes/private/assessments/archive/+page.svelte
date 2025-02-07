<script lang="ts">
    import {goto} from '$app/navigation';
    import {config,usr,cohorts} from '$lib/state.svelte';
    import {alert} from '$lib/state.svelte';
    import * as assessments from '../assessment.svelte';
    import * as util from '$lib/util';
    import * as chart from '$lib/chart';
    import * as icon from '$lib/icon';
    import * as file from '$lib/file';
   
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
   
    
    let download = async(index:number):Promise<void> => {
        //console.log(data.table.assessments[index]);
        const select=`select=id,nc,yr,n,dl,dt,sc,ss,sl,log,gd,t,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
        const filter=`id=eq.${data.table.assessments[index].id}`;

        let response = await fetch('/private/edge/read', {
            method: 'POST',
            body: JSON.stringify({table:'assessment_table',select:select,filter:filter}),
            headers: {'content-type': 'application/json'}
        });
        const res= await response.json();
        console.log(res);

        const csv:string[][]=[[String(cohorts.archive.subjects[cohorts.archive.sIndex].sl),'n','dl','nc','yr','pid','sn','pn','g','t','gd','pc','fb','log']];
        if(res?.[0].result_table?.[0]) {
            res[0].result_table.forEach((row:any)=>{
                csv.push(['',res[0].n,res[0].dl,res[0].nc,res[0].yr,row.pid,row.sn,row.pn,row.g,`[${row.t.toString()}]`,row.gd,row.pc,row.fb,row.log]);
            });
        }
        if(res?.[0].gd?.[0] && !res?.[0].isGrade) {
            csv.push(['','gd','pc']);
            res[0].gd.forEach((row:any)=>{
                csv.push(['',row.gd,row.pc]);
            });
        }
        if(res?.[0].t?.[0] && !res?.[0].isGrade) {
            csv.push(['','p','t','w']);
            res[0].t.forEach((row:any)=>{
                csv.push(['',row.p,row.t,row.w]);
            });
        }


        file.csvDownload(csv,'ARCHIVE.csv');



    };

    let downloadAll = ():void =>{
        const csv:string[][]=[[String(cohorts.archive.subjects[cohorts.archive.sIndex].sl)+'/'+String(cohorts.archive.subjects[cohorts.archive.sIndex].nc)+'/'+String(cohorts.archive.subjects[cohorts.archive.sIndex].yr),'','',`${data.std.A}/${data.std.A!=='GCSE' ? 'Band' : 'AvgGCSE'}`,`${data.std.B}/${data.std.B!=='GCSE' ? 'Band' : 'AvgGCSE'}`,`${data.std.A}/Pred`,`${data.std.B}/Pred`,...data.table.assessments.map(el=>`${el.n} ${el.ds}`)]];
        data.table.pupil.forEach((row:any)=>{
            let r = [row.pid,row.sn,row.pn,data.std.A!=='GCSE' ? util.getBand(row.overall.A): row.overall.A,data.std.B!=='GCSE' ? util.getBand(row.overall.B):row.overall.B,row.pre.A,row.pre.B];
            row.results.forEach((col:any)=>{
                r.push(col.gd);
            });
            csv.push(r);
        });
        file.csvDownload(csv,'ARCHIVE-OVERALL.csv');
    };
    
    
    $effect(() => {
        if(config.isReady===false || usr.isTeacher===false) goto(`/`);
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
                <span class="spacer">
                    <a data-title="DOWNLOAD" href={'javascript:void(0)'} onclick={downloadAll}>{@html icon.download(24)}</a>&nbsp;
              
                </span>
                <span class="spacer">
                    <button onclick={()=>goto('private//assessments')}>Back</button>
                  
                </span>
        </fieldset>

        

    <figure>

        <table class="small">
            <thead>
                
                <tr>
                    <th></th>
                  
                    <th> {@html chart.getAssessmentTitle(data.std.A,"Intake")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.B,"Intake")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.A,"Prediction")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.B,"Prediction")}</th>
                    {#each data.table.assessments as col,colIndex}
                    <th>
                        <a data-title={'DOWNLOAD'} href={'javascript:void(0)'} onclick={()=>download(colIndex)}>{@html icon.download()}</a> 
                        {@html chart.getAssessmentTitle(col.n,col.ds)}
                    </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each data.table.pupil as row}
                    <tr>
                        <td>{row.sn} {row.pn}</td>
                        <td>{@html chart.getIntakeBar(row.overall.A,data.std.A)}</td>
                        <td>{@html chart.getIntakeBar(row.overall.B,data.std.B)}</td>
                        <td>{row!.pre!.A}</td>
                        <td>{row!.pre!.B}</td>
                        {#each row.results as col,colIndex}
                            <td>{@html chart.getGrade(colIndex===0 ? false : true,col.gd,col.r)}</td>
                        {/each}
                    </tr>
                {/each}

            </tbody>



        </table>
    </figure>

   


    <style>

    </style>