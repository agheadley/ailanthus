<script lang="ts">
import { goto } from '$app/navigation';
    
import {cohorts,config} from '$lib/state.svelte';
import * as assessment from './../assessment.svelte';


interface Data  {
    assessment:{id:number,n:string,isLock:boolean,isGrade:boolean,gd:{gd:string,pc:number,sc:string,pre:number}[],t:{t:number,w:number,p:string}[]},
    results:{id:number|null,x:boolean,g:string,pid:number,pn:string,sn:string,t:number[],gd:string,pc:number,fb:string}[],
    view:'group'|'all'
}

const data : Data = $state({
    assessment:{id:0,n:'',isLock:true,isGrade:false,gd:[{sc:'',gd:'',pc:0,pre:0}],t:[{t:0,w:0,p:''}]},
    results:[],
    view:'group'
});

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
};

const validateGrade=(rowIndex:number):void=>{

};
const focusGrade=(rowIndex:number):void=>{

};
const blurGrade=(rowIndex:number):void=>{

};

const calculate=(rowIndex:number)=>{

};

$effect(() => {
        (async () => {
            if(config.isReady===false) goto(`/`);
            $inspect(cohorts.edit);
            const res=await assessment.getEditTable();
            console.log(res);
            data.assessment=res.assessment;
            data.results=res.results; 
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


<p>
    {JSON.stringify(cohorts.edit)};
</p>

<div class="row">
    <div class="col">
        <input id="radio-group" type="radio" bind:group={data.view} name='data-view' value={'group'} />
        <label for="radio-group">{cohorts.edit.g}</label>
        <input id="radio-all" type="radio" bind:group={data.view} name='data-view' value={'all'} />
        <label for="radio-all">All</label>
    </div>
    <div class="col">{data.view}</div>
    <div class="col"></div>
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
                <td class="w10">{row.sn} {row.pn}</td>
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
                <td><textarea id={`textarea-fb-${rowIndex}`} class="fb" value={row.fb} onblur={()=>calculate(rowIndex)}></textarea></td>
                {:else}
                    <td>
                        <input class="score" id={`R${rowIndex}C${0}`} tabindex={(1)*data.results.length+rowIndex+1} disabled='{!cohorts.edit.isEdit || row.x}' type=text bind:value={row.gd} oninput={()=>validateGrade(rowIndex)} onfocus={()=>focusGrade(rowIndex)} onblur={()=>blurGrade(rowIndex)}/>           
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

