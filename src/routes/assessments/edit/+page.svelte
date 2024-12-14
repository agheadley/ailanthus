<script lang="ts">
import { goto } from '$app/navigation';
import {user,cohorts,config,alert} from '$lib/state.svelte';
import * as assessment from './../assessment.svelte';
import * as util from '$lib/util';
import Modal from '$lib/_Modal.svelte';
import * as chart from '$lib/chart';
import * as icon from '$lib/icon';
import Manage from './Manage.svelte';

interface Data  {
    assessment:{id:number,n:string,isCore:boolean,isLock:boolean,isGrade:boolean,gd:{gd:string,pc:number,sc:string,pre:number}[],t:{t:number,w:number,p:string}[]},
    results:{id:number|null,x:boolean,g:string,pid:number,pn:string,sn:string,t:number[],gd:string,pc:number,fb:string,overall:{A:number,B:number},pre:{A:number,B:number}}[],
    std:{A:string,B:string}
    view:'group'|'all',
    isIntake:boolean,
    isDownload:boolean,
    isManage:boolean,
    isLock:boolean,
    rowIndex:number
}

let data : Data = $state({
    assessment:{id:0,n:'',isCore:false,isLock:true,isGrade:false,gd:[{sc:'',gd:'',pc:0,pre:0}],t:[{t:0,w:0,p:''}]},
    results:[],
    std:{A:'',B:''},
    view:'group',
    isIntake:false,
    isDownload:false,
    isManage:false,
    isLock:false,
    rowIndex:0
});



let updateAssessment=async():Promise<void>=>{

    let dArr=[];
    for(const item of data.results) {
        //build the totals to match assessment changes
        item.t=data.assessment.t.map((el,i)=>item?.t?.[i] ? item.t[i] : 0);
        item.pc=assessment.getPercentage(item.t, data.assessment.t);
        item.gd=assessment.getGrade(item.pc,data.assessment.gd);
       
        let d : {id?:number,aid?:number,t:number[],gd:string,pc:number,g:string,fb:string,log:string,sn?:string,pn?:string,pid?:number}
        if(item.id!==null) 
            d={id:item.id,t:item.t,pc:item.pc,gd:item.gd,log:`${user.name}|${util.getDateTime()}`,g:item.g,fb:item.fb}
        else 
            d= {sn:item.sn,pn:item.pn,pid:item.pid,aid:data.assessment.id,t:item.t,pc:item.pc,gd:item.gd,log:`${user.name}|${util.getDateTime()}`,g:item.g,fb:item.fb};
    
        dArr.push(d);
 
    }


    console.log(dArr);

    /*
    let response = await fetch('/api/upsert', {
		method: 'POST',
		body: JSON.stringify({table:"result_table",data:d}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	//console.log('UPSERT',res);
    if(data.results[rowIndex].id===null && res?.[0]?.id)  data.results[rowIndex].id=res[0].id;

    if(res?.[0]?.id) {
        alert.msg=`${data.results[rowIndex].sn} ${data.results[rowIndex].pn} updated`;
    } else {
        alert.type='error';
        alert.msg=`${data.results[rowIndex].sn} ${data.results[rowIndex].pn} error`;
    }
    */

    // update assessment too , name, t, gd


    
};


let lockAssessment=async():Promise<void>=>{

    const response = await fetch('/api/update', {
        method: 'POST',
        body: JSON.stringify({table:"assessment_table",id:data.assessment.id,update:{isLock:true}}),
        headers: {'content-type': 'application/json'}
    });
    const res= await response.json();
    if(res?.[0]?.isLock) {
        alert.msg=`ASSESSMENT ${data.assessment.n} locked`;
        cohorts.edit.isEdit=false;
        data.assessment.isLock=true;
        data.isLock=false;
    }
    else {
        alert.type='error';
        alert.msg='error locking assessment'
    }

    

};

const validateScore=(rowIndex:number,colIndex:number):void=>{
    console.log('validate',rowIndex,colIndex);
    if(data.results[rowIndex].t[colIndex]<0 || data.results[rowIndex].t[colIndex]===null) data.results[rowIndex].t[colIndex]=0;
    data.results[rowIndex].t[colIndex] = Math.round(data.results[rowIndex].t[colIndex]);
    if(data.results[rowIndex].t[colIndex]>data.assessment.t[colIndex].t) data.results[rowIndex].t[colIndex] =0;
};

const focusScore=(rowIndex:number,colIndex:number):void=>{
    //console.log('focus',rowIndex,colIndex);
};

const blurScore=async(rowIndex:number,colIndex:number):Promise<void>=>{
    console.log('blur',rowIndex,colIndex);
    // update results if others are entering data, and db row exists (has an id)
    if(data.results[rowIndex].id) {
        const select=`select=id,t`;
        const filter=`id=eq.${data.results[rowIndex].id}`;
        
        let response = await fetch('/edge/read', {
            method: 'POST',
            body: JSON.stringify({table:'result_table',filter:filter,select:select}),
            headers: {'content-type': 'application/json'}
        });
        let res= await response.json();
        // populate other columns with data just read, leave active column!
        $state.snapshot(data.results[rowIndex].t);

        if(res?.[0].t?.[0]) data.results[rowIndex].t=data.results[rowIndex].t.map((el,i)=>i!==colIndex ? res[0].t[i] : el);
        
    }

    await calculate(rowIndex);

};

const validateGrade=(rowIndex:number):void=>{
    let gdArr=data.assessment.gd.map(el=>el.gd);
    console.log(gdArr,data.results[rowIndex].gd);
    if(!gdArr.includes(data.results[rowIndex].gd)) data.results[rowIndex].gd='';
   
    
};
const focusGrade=(rowIndex:number):void=>{

};
const blurGrade=async(rowIndex:number):Promise<void>=>{
    if( data.results[rowIndex].gd==='')  data.results[rowIndex].gd='X';
    await calculate(rowIndex);
};

const calculate=async(rowIndex:number):Promise<void>=>{
    alert.ms=1000;

    if(data.assessment.isGrade===false) {
        if( data.results[rowIndex].x) {
            data.results[rowIndex].gd='X';
            data.results[rowIndex].pc=0;
            
        } else {
            data.results[rowIndex].pc=assessment.getPercentage(data.results[rowIndex].t, data.assessment.t);
            data.results[rowIndex].gd=assessment.getGrade(data.results[rowIndex].pc,data.assessment.gd);
        }
    } else {
        data.results[rowIndex].pc=0;
    }
    
    

    let d : {id?:number,aid?:number,t:number[],gd:string,pc:number,g:string,fb:string,log:string,sn?:string,pn?:string,pid?:number}
    if(data.results[rowIndex].id!==null) 
        d={id:data.results[rowIndex].id,t:data.results[rowIndex].t,pc:data.results[rowIndex].pc,gd:data.results[rowIndex].gd,log:`${user.name}|${util.getDateTime()}`,g:data.results[rowIndex].g,fb:data.results[rowIndex].fb}
    else 
        d= {sn:data.results[rowIndex].sn,pn:data.results[rowIndex].pn,pid:data.results[rowIndex].pid,aid:data.assessment.id,t:data.results[rowIndex].t,pc:data.results[rowIndex].pc,gd:data.results[rowIndex].gd,log:`${user.name}|${util.getDateTime()}`,g:data.results[rowIndex].g,fb:data.results[rowIndex].fb};
   
    let response = await fetch('/api/upsert', {
		method: 'POST',
		body: JSON.stringify({table:"result_table",data:d}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	//console.log('UPSERT',res);
    if(data.results[rowIndex].id===null && res?.[0]?.id)  data.results[rowIndex].id=res[0].id;

    if(res?.[0]?.id) {
        alert.msg=`${data.results[rowIndex].sn} ${data.results[rowIndex].pn} updated`;
    } else {
        alert.type='error';
        alert.msg=`${data.results[rowIndex].sn} ${data.results[rowIndex].pn} error`;
    }
    
};

const openIntake=(rowIndex:number):void=>{
    data.rowIndex=rowIndex;
    data.isIntake=true;
};

$effect(() => {
        (async () => {
            if(config.isReady===false) goto(`/`);
            
            const res=await assessment.getEditTable();
            console.log(res);
            data.assessment=res.assessment;
            data.results=res.results; 
            data.std=res.std;
            $state.snapshot(data);            

        })()
});

let getCellPosition=(id:string)=>{
    let r=id.indexOf('R');
    let c=id.indexOf('C');
    if(r>=0 && c>=0 && c>r) {
        return {r:Number(id.substring(r+1,c)),c:Number(id.substring(c+1))};
    } else return null;
};


let handleKeydown=(event:any)=>{

    let cell=getCellPosition(document.activeElement ? document.activeElement.id : '');
    //console.log(cell);

    if(cell) {
       
            
            if (event.keyCode === 38) {
                event.preventDefault();
                document.getElementById(`R${cell.r-1}C${cell.c}`)?.focus();
               
            }
            if(event.keyCode===40 || event.keyCode===13) {
                event.preventDefault();
                document.getElementById(`R${cell.r+1}C${cell.c}`)?.focus();  
            }
            if(event.keyCode===39) {
                event.preventDefault();
                document.getElementById(`R${cell.r}C${cell.c+1}`)?.focus();
            } 
                    
            if(event.keyCode===37)  {
                event.preventDefault();
                document.getElementById(`R${cell.r}C${cell.c-1}`)?.focus();
            }
        
    }
   
};


</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
    <title>Edit</title>
    <meta name="description" content="ailanthus" />
</svelte:head>

{#if data.isManage}
<Modal bind:open={data.isManage} title={'Update Totals,Boundaries & Name'}>
    {#snippet children()}
    <Manage bind:data={data}></Manage>
    <p><button onclick={updateAssessment}>Save Changes</button></p>
    {/snippet}
</Modal>

{/if}

{#if data.isLock}
<Modal bind:open={data.isLock} title={'Lock and Make Live ?'}>
    {#snippet children()}
    <p class="notice">Locking the assessment will make it live for pupils / overview. Only the administrator can unlock to allow futher grade changes after locking.</p>
    <p><button onclick={lockAssessment}>Lock & Send Live</button></p>
    {/snippet}
</Modal>
{/if}


{#if data.isIntake}
<Modal bind:open={data.isIntake} title={`${data.results[data.rowIndex].sn} ${data.results[data.rowIndex].pn}`}>
    {#snippet children()}
    <table class="small">
        <tbody>
            <tr>
                <th></th>
                <th>{data.std.A}</th>
                <th>{data.std.B}</th>
            </tr>
            <tr>
                <th>OVERALL</th>
                <td>{@html chart.getIntakeBar(data.results[data.rowIndex].overall.A,data.std.A)}</td>
                <td>{@html chart.getIntakeBar(data.results[data.rowIndex].overall.B,data.std.B)}</td>
            </tr>
            <tr>
                <th>CHANCES</th>
                <td>{@html chart.getChance(cohorts.edit.sc,data.results[data.rowIndex].pre.A)}</td>
                <td>{@html chart.getChance(cohorts.edit.sc,data.results[data.rowIndex].pre.B)}</td>
            </tr>
        </tbody>
    </table>
    
{/snippet}
</Modal>
{/if}

<div class="row">
    <div class="col">
        <input id="radio-group" type="radio" bind:group={data.view} name='data-view' value={'group'} />
        <label for="radio-group">{cohorts.edit.g}</label>
        <input id="radio-all" type="radio" bind:group={data.view} name='data-view' value={'all'} />
        <label for="radio-all">All</label>
    </div>
    <div class="col">
        <button disabled={data.assessment.isGrade} onclick={()=>data.isManage=true}>Boundary/Total</button>&nbsp;&nbsp;
        <a data-title="DOWNLOAD" href={'javascript:void(0)'} onclick={()=>data.isDownload=true}>{@html icon.download(24)}</a>&nbsp;&nbsp;
        <button disabled={data.assessment.isLock || data.assessment.isCore} onclick={()=>data.isLock=true}>Send Live</button>
        
    </div>
</div>
<table class="small">
    <tbody>
        <tr>
            <th></th>
            <th></th>
            {#if !data.assessment.isGrade}
            {#each data.assessment.t as col,colIndex}
                <th>{col.p}/{col.t}</th>
            {/each}
            <th>&nbsp%&nbsp;</th>
            <th>GRD</th>
            <th>Abs?</th>
            <th>Feedback</th>
            {:else}
            <th>GRD</th>
            {/if}
        </tr>
        {#each data.results as row,rowIndex}
            {#if (data.view==='group' && row.g===cohorts.edit.g ) ||  data.view==='all'}
            <tr>
                <td class="w10"><a href={'javascript:void(0)'} onclick={()=>openIntake(rowIndex)}>{row.sn} {row.pn}</a></td>
                <td>{row.g}</td>
                {#if !data.assessment.isGrade}
                {#each row.t as col,colIndex}
                    <td>
                        <input class="score" id={`R${rowIndex}C${colIndex}`} tabindex={(colIndex+1)*data.results.length+rowIndex+1} disabled='{!cohorts.edit.isEdit || row.x}' min=0 step=1 type=number bind:value={row.t[colIndex]} oninput={()=>validateScore(rowIndex,colIndex)} onfocus={()=>focusScore(rowIndex,colIndex)} onblur={()=>blurScore(rowIndex,colIndex)}/>           
                    </td>
                {/each}
                <td>{row.pc}</td>
                <th>{row.gd}</th>
                <td><input type=checkbox bind:checked={row.x} onchange={()=>calculate(rowIndex)}/></td>
                <td><textarea id={`textarea-fb-${rowIndex}`} class="fb" bind:value={row.fb} onblur={()=>calculate(rowIndex)}></textarea></td>
                
                {:else}
                    <td>
                        <input class="score" id={`R${rowIndex}C${0}`} tabindex={(1)*data.results.length+rowIndex+1} disabled='{!cohorts.edit.isEdit}' type=text bind:value={row.gd} oninput={()=>validateGrade(rowIndex)} onfocus={()=>focusGrade(rowIndex)} onblur={()=>blurGrade(rowIndex)}/>           
                    </td>
                {/if}
            </tr>
            {/if}
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

.fb {
    width:15rem;
    height:2rem;
    overflow:hidden;
}

.fb:focus {
    height:7rem;
    overflow-x:hidden;
    overflow-y:scroll;
}


.score {
    width:3rem;
    max-width:3rem;
    -moz-appearance: textfield;
    appearance: textfield;
    
}

.score::-webkit-outer-spin-button,
.score::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}


</style>

