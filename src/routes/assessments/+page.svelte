<script lang="ts">
    import { goto } from '$app/navigation';
    import * as icon from '$lib/icon';
    import * as chart from '$lib/chart';
    import {cohorts,config,user,alert} from '$lib/state.svelte';
    import * as assessment from './assessment.svelte';
    import * as util from '$lib/util';
    import Modal from '$lib/_Modal.svelte';
    import Create from './Create.svelte';
	import * as file from '$lib/file';

    let data : any = $state({
        table:[],
        std:{A:'',B:''},
        subject:{sc:'',ss:'',sl:'',nc:0,yr:0},
        isCreate:false,
        isUpdateRequired:true

    });

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

/*
 `${data.std.A}/${data.std.A!=='GCSE' ? 'Band' : 'AvgGCSE'}`,
            `${data.std.B}/${data.std.B!=='GCSE' ? 'Band' : 'AvgGCSE'}`,
           
*/

    let download=():void=>{
        const s= cohorts.subject.list[cohorts.subject.index];

        let csv:string[][] =[[
            `${s.sl}/${String(s.nc)}/${String(s.yr)}`,'','',
            `${data.std.A}/${data.std.A!=='GCSE' ? 'Band' : 'AvgGCSE'}`,
            `${data.std.B}/${data.std.B!=='GCSE' ? 'Band' : 'AvgGCSE'}`,
            '',
            ... data.table[0].assessments.map((el: { n: string; ds: string; })=>`${el.n}/${el.ds}`)
        
        ]];

        data.table.forEach((group:any)=>{
            csv.push([
                '','','',
                data.std.A!=='GCSE' ? util.getBand(group.overall.A) : group.overall.A,
                data.std.B!=='GCSE' ? util.getBand(group.overall.B) : group.overall.B,
                group.g,
                ...group.assessments.map((el: { gd: string; })=>el.gd)

            ]);
            group.pupil.forEach((row:any)=>{
                csv.push([row.pid,row.sn,row.pn,
                    data.std.A!=='GCSE' ? util.getBand(row.overall.A) : row.overall.A,
                    data.std.B!=='GCSE' ? util.getBand(row.overall.B) : row.overall.B,
                    group.g,
                    ...row.results.map((el: { gd: string; })=>el.gd)
                ])
            });

        });



        file.csvDownload(csv,'ASSESSMENTS.csv');

    }

  
    
    let create=async():Promise<void>=>{
        data.isCreate=true;
    }

    let updateTable=async(type?:string):Promise<void>=>{
        
       
        if(type==='MYSET') {
            //console.log('UPDATE ',cohorts.mySets.list[cohorts.mySets.index].g);

            let i = cohorts.nc.list.findIndex(el=>el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.nc.index = i > -1 ? i : 0;

            i = cohorts.subject.list.findIndex(el=>el.sc===cohorts.mySets.list[cohorts.mySets.index].sc && el.ss===cohorts.mySets.list[cohorts.mySets.index].ss && el.nc===cohorts.mySets.list[cohorts.mySets.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
            
           
        } else if(type==='NC') {
            //console.log('UPDATE ',cohorts.nc.list[cohorts.nc.index].nc,cohorts.subject.list[cohorts.subject.index].sl);
            let i = cohorts.subject.list.findIndex(el=>el.nc===cohorts.nc.list[cohorts.nc.index].nc);
            cohorts.subject.index = i > -1 ? i : 0;
        }

        data.table = await assessment.getTable(cohorts.subject.list[cohorts.subject.index].yr,cohorts.subject.list[cohorts.subject.index].nc,cohorts.subject.list[cohorts.subject.index].sc,cohorts.subject.list[cohorts.subject.index].ss); 
     
        data.std=util.getStd( cohorts.nc.list[ cohorts.nc.index].nc);
        //$state.snapshot(data.table);

        data.subject.nc=cohorts.nc.list[cohorts.nc.index].nc;
        data.subject.yr=cohorts.nc.list[cohorts.nc.index].yr;
        data.subject.sc=cohorts.subject.list[cohorts.subject.index].sc;
        data.subject.ss=cohorts.subject.list[cohorts.subject.index].ss;
        data.subject.sl=cohorts.subject.list[cohorts.subject.index].sl;

        console.log('UPDATED',cohorts.nc.list[cohorts.nc.index].nc,cohorts.subject.list[cohorts.subject.index].sl,data.table?.length ? `FOUND ${data.table.length} GROUP(S)` : `FOUND 0 GROUPS`);

        data.isUpdateRequired=false;

        //console.log(data.subject);

    };

  
    const toggleLock=async (index:number):Promise<void>=>{
        //console.log(data.table[0].assessments[index]);
        let id =data.table[0].assessments[index].id;
        let isLock=data.table[0].assessments[index].isEdit ? true : false;
        const response = await fetch('/api/update', {
            method: 'POST',
            body: JSON.stringify({table:"assessment_table",id:id,update:{isLock:isLock}}),
            headers: {'content-type': 'application/json'}
        });
        const res= await response.json();
        alert.msg=`ASSESSMENT ${data.table[0].assessments[index].n} ${res?.[0]?.isLock ? 'LOCKED' : 'OPEN'}`;
        data.table[0].assessments[index].isEdit = !res?.[0]?.isLock;


    };

    const openEdit=(groupIndex:number,colIndex:number)=>{
        cohorts.edit = {
            id:data.table[groupIndex].assessments[colIndex].id,
            nc:data.table[groupIndex].assessments[colIndex].nc,
            yr:data.table[groupIndex].assessments[colIndex].yr,
            sc:data.table[groupIndex].assessments[colIndex].sc,
            ss:data.table[groupIndex].assessments[colIndex].ss,
            sl:data.table[groupIndex].assessments[colIndex].sl,
            g:data.table[groupIndex].g,
            n:data.table[groupIndex].assessments[colIndex].n,
            dt:data.table[groupIndex].assessments[colIndex].dt,
            ds:data.table[groupIndex].assessments[colIndex].ds,
            isEdit:data.table[groupIndex].assessments[colIndex].isEdit
        };
        goto('/assessments/edit');
        
    };
 
   
    $effect(() => {
            //console.log('data update');
            //$inspect(data.isUpdateRequired);
            (async () => {
              
                
                if(data.isUpdateRequired===true) {
                    await updateTable();
                    data.isUpdateRequired=false;
                }
                


		    })()
	});

    
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
    <fieldset>
        <legend>Assessments by Cohort / My Sets</legend>
            <span class="spacer">
                <select bind:value={cohorts.nc.index} onchange={()=>updateTable('NC')}>
                    {#each cohorts.nc.list as row,index}
                    <option value={index}>{row.nc}</option>
                    {/each}
                </select>
                </span>
                <span class="spacer">
                <select bind:value={cohorts.subject.index} onchange={()=>updateTable()}>
                    {#each cohorts.subject.list as row,index}
                    {#if row.nc===cohorts.nc.list[cohorts.nc.index].nc}
                    <option value={index}>{row.sl} ({row.sc})</option>
                    {/if}
                    {/each}
                </select>
                </span>
                <span class="spacer">
        
                    <select bind:value={cohorts.mySets.index} onchange={()=>updateTable('MYSET')}>
                        {#each cohorts.mySets.list as row,index}
                        <option value={index}>{row.g}</option>
                        {/each}
                    </select>
                </span>
           <span class="spacer">
                <a data-title="CREATE" href={'javascript:void(0)'} onclick={create}>{@html icon.plusCircle(24)}</a>&nbsp;
                 <a data-title="DOWNLOAD" href={'javascript:void(0)'} onclick={download}>{@html icon.download(24)}</a>&nbsp;
                <a data-title="ARCHIVE" href={'/assessments/archive'}>{@html icon.archive(24)}</a>
               
            </span>
        </fieldset>

        <figure>
        <table class="small">

            <tbody>
              
                {#if user.isAdmin && data.table?.[0]}
                    <tr>
                        <th>ADMIN</th>
                        <th></th>
                        <th></th>
                        {#each data.table[0].assessments as col,colIndex}
                            <th><a data-title={col.isEdit ? 'LOCK' : 'UNLOCK'} href={'javascript:void(0)'} onclick={()=>toggleLock(colIndex)}>{@html col.isEdit ? icon.unlock() : icon.lock()}</a></th>
                        {/each}
                    </tr>
                {/if}
                {#each data.table as group,groupIndex}
                <tr>
                    <th></th>
                    <th> {@html chart.getAssessmentTitle(data.std.A,"Intake")}</th>
                    <th> {@html chart.getAssessmentTitle(data.std.B,"Intake")}</th>
                    {#each group.assessments as col,colIndex}
                        <th>
                            <a data-title={col.isEdit ? 'EDIT' : 'VIEW'} href={'javascript:void(0)'} onclick={()=>openEdit(groupIndex,colIndex)}>{@html col.isEdit ? icon.edit() : icon.view()}</a>
                            {@html chart.getAssessmentTitle(col.n,col.ds)}
                        </th>
                    {/each}
                </tr>
                <tr>
                    <th>{group.g}</th>
                    <th>{@html chart.getIntakeBar(group.overall.A,data.std.A)}</th>
                    <th>{@html chart.getIntakeBar(group.overall.B,data.std.B)}</th>
                    {#each group.assessments as col,colIndex}
                        <th>{@html chart.getGrade(colIndex===0 ? false : true,col.gd,col.r)}</th>
                    {/each}
                </tr>

                {#each group.pupil as row,rowIndex}
                <tr>
                    <td>
                        <div class="w10">{row.sn} {row.pn}</div>
                    </td>

                    <td>{@html chart.getIntakeBar(row.overall.A,data.std.A)}</td>
                    <td>{@html chart.getIntakeBar(row.overall.B,data.std.B)}</td>
                    {#each row.results as col,colIndex}
                    <td>{@html chart.getGrade(colIndex===0 ? false : true,col.gd,col.r)}</td>
                    {/each}
                    
                </tr>
                {/each}



                {/each}
            </tbody>
           
        </table>
    </figure>

    
    <style>
    
        .w10 {
            max-width:10rem;
            word-wrap: break-word;
            white-space: nowrap;
            overflow:hidden;
          
            
        }

     


    
    </style>
    