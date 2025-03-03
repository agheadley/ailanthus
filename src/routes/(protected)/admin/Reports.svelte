<script lang="ts">
import {config,cohorts,alert} from '$lib/state.svelte';
import Modal from '$lib/_Modal.svelte';
import * as icon from '$lib/icon'


interface Cycle {
    id?:number,
    created_at?:string,
    yr:number
    period:{term:string,session:string,ay:string},
    content:{nc:number,detail:{type:string,isCreate:boolean}[]}[],
    limit:{A:{min:number,max:number},P:{min:number,max:number},E:{min:number,max:number}},
    isActive:boolean,
    isPublish:boolean
}

interface Status  {
    view:{index:number,list:string[]},
    cycle:Cycle[],
    yr:number,
    ay:string,
    limit:{A:{min:number,max:number},P:{min:number,max:number},E:{min:number,max:number}},
    term:{list:string[],index:number},
    session:{list:string[],index:number},
    types:string[],
    isContent:boolean,
    isAdd:boolean,
    cycleIndex:number
}

let status :Status= $state({
    view:{index:0,list:['Cycle','Edit','Print']},
    cycle:[],
    yr:0,
    ay:'',
    limit:{A:{min:180,max:600},P:{min:300,max:800},E:{min:300,max:800}},
    term:{list:['Winter','Spring','Summer'],index:0},
    session:{list:['1st','2nd'],index:0},
    types:['hod','teacher','effort','enrichment','tutor','hm','sa','slt'],
    effort:{
        sections:[
          {name:'Lessons',types:['Readiness','Engagement']},
          {name:'Outside',types:['Prep']}
        ],
        default:3,
        values:[{txt:'4',value:4},{txt:'3',value:3},{txt:'2',value:2},{txt:'1',value:1},{txt:'N/A',value:null}]
    }, 
    isContent:false,
    isAdd:false,
    cycleIndex:0

});

/*
term:['Winter','Spring','Summer'],
      session:['1st','2nd'],
      effort:{types:['Class','Prep'],default:3,values:[{txt:'4',value:4},{txt:'3',value:3},{txt:'2',value:2},{txt:'1',value:1},{txt:'N/A',value:null}]},
      length:{A:{min:180,max:600},P:{min:300,max:800},E:{min:300,max:800}},
*/

const addCycle=async()=>{
    status.yr=new Date().getFullYear();
    const m=new Date().getMonth()+1;
    status.ay = m>config.year.rollover.month ? `${String(status.yr)}/${String(status.yr+1)}` : `${String(status.yr-1)}/${String(status.yr)}`;
   
    
    let content = config.year.yr.map(el=>({nc:el.nc,detail:status.types.map(e=>({type:e,isCreate:false}))}));
    const c= {
        yr:status.yr,
        period:{term:status.term.list[status.term.index],session:status.session.list[status.session.index],ay:status.ay},
        content:content,
        limit:{A:{min:status.limit.A.min,max:status.limit.A.max},P:{min:status.limit.P.min,max:status.limit.P.max},E:{min:status.limit.E.min,max:status.limit.E.max}},
        isActive:false,
        isPublish:false
    };

    let response = await fetch('/api/upsert', {
            method: 'POST',
            body: JSON.stringify({table:"cycle_table",data:c}),
            headers: {'content-type': 'application/json'}
    });
    let res= await response.json();

    await readCycle();

    status.cycleIndex= status.cycle.length && status.cycle.length>0 ? status.cycle.length-1 : 0;



    console.log(status.cycle);
   
   
   
    status.isAdd=true;
    status.isContent=true;
  
};

const editContent=(index:number)=>{
    status.cycleIndex=index;
    status.isContent=true;
};

const readCycle=async()=>{
    let response = await fetch('/edge/read', {
            method: 'POST',
            body: JSON.stringify({table:'cycle_table',select:'*',order:'order=id.asc'}),
            headers: {'content-type': 'application/json'}
    });   
    status.cycle= await response.json();
   
};

const setActive=async(index:number)=>{
    let x=status.cycle[index].isActive;
    for(let item of status.cycle) item.isActive=false;
    status.cycle[index].isActive=x;
    let response = await fetch('/api/upsert', {
            method: 'POST',
            body: JSON.stringify({table:"cycle_table",data:status.cycle[status.cycleIndex]}),
            headers: {'content-type': 'application/json'}
    });
    let res= await response.json();
    console.log(res);
    if(res?.[0]) {
        status.isContent=false;
        alert.msg='Cycle updated';
    } else {
        alert.type='error';
        alert.msg='Error saving cycle'
    }
};

const setPublish=async(index:number)=>{
  
  
    let response = await fetch('/api/upsert', {
            method: 'POST',
            body: JSON.stringify({table:"cycle_table",data:status.cycle[status.cycleIndex]}),
            headers: {'content-type': 'application/json'}
    });
    let res= await response.json();
    console.log(res);
    if(res?.[0]) {
        status.isContent=false;
        alert.msg='Cycle updated';
    } else {
        alert.type='error';
        alert.msg='Error saving cycle'
    }
};

const save=async()=>{
    let response = await fetch('/api/upsert', {
            method: 'POST',
            body: JSON.stringify({table:"cycle_table",data:status.cycle[status.cycleIndex]}),
            headers: {'content-type': 'application/json'}
    });
    let res= await response.json();
    console.log(res);
    if(res?.[0]) {
        status.isContent=false;
        alert.msg='Cycle saved';
    } else {
        alert.type='error';
        alert.msg='Error saving cycle'
    }

    await readCycle();

};

const setup = async()=>{
    status.term.list=config.report.term;
    status.session.list=config.report.session;
    status.types=config.report.types;
    status.limit=config.report.limit;
    status.yr=new Date().getFullYear();
    await readCycle();

};



$effect(() => {
   setup();
            
});

</script>

<p>
    <span class="tab spacer">
        {#each status.view.list as item,index} 
        <a href={'javascript:void(0)'} onclick={()=>status.view.index=index} class={status.view.index===index ? 'selected' : ''}>{item}</a>&nbsp;&nbsp;
        {/each}
      
    </span>
</p>
    
<Modal  bind:open={status.isContent} title={'Cycle Content'}>
    {#snippet children()}
        <p>
            <b>{status.yr}</b>
            {#if status.isAdd}
            <select bind:value={status.term.index}>
                {#each status.term.list as row,index}
                <option value={index}>{row}</option>
                {/each}
            </select>
            <select bind:value={status.session.index}>
                {#each status.session.list as row,index}
                <option value={index}>{row}</option>
                {/each}
            </select>
            {:else}
                <b>{status.term.list[status.term.index]} {status.session.list[status.session.index]}</b>
            {/if}
        </p>

        <table class="small">
            <thead>
                <tr>
                    <th>Report Type</th>
                    <th>Min Chars</th>
                    <th>Max Chars</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>A</td>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.A.min  = status.cycle[status.cycleIndex].limit.A.min > 0 ? status.cycle[status.cycleIndex].limit.A.min  : 0} bind:value={status.cycle[status.cycleIndex].limit.A.min }/>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.A.max  = status.cycle[status.cycleIndex].limit.A.max > 0 ? status.cycle[status.cycleIndex].limit.A.max : 0} bind:value={status.cycle[status.cycleIndex].limit.A.max }/>
                    </td>
                </tr>
                <tr>
                    <td>E</td>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.E.min  = status.cycle[status.cycleIndex].limit.E.min > 0 ? status.cycle[status.cycleIndex].limit.E.min  : 0} bind:value={status.cycle[status.cycleIndex].limit.E.min }/>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.E.max  = status.cycle[status.cycleIndex].limit.E.max > 0 ? status.cycle[status.cycleIndex].limit.E.max  : 0} bind:value={status.cycle[status.cycleIndex].limit.E.max }/>
                    </td>
                </tr>
                <tr>
                    <td>P</td>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.P.min  = status.cycle[status.cycleIndex].limit.P.min > 0 ? status.cycle[status.cycleIndex].limit.P.min  : 0} bind:value={status.cycle[status.cycleIndex].limit.P.min }/>
                    <td><input type=number step="1" onchange={()=>status.cycle[status.cycleIndex].limit.P.max  = status.cycle[status.cycleIndex].limit.P.max > 0 ? status.cycle[status.cycleIndex].limit.P.max : 0} bind:value={status.cycle[status.cycleIndex].limit.P.max }/>
                    </td>
                </tr>
            </tbody>
        </table>

        <table>
            <thead>
                <tr>
                    <th>nc</th>
                    {#each status.types as col,colIndex}
                        <th>{col}</th>
                    {/each}
                </tr>               
            </thead>
            <tbody>
                {#each status.cycle[status.cycleIndex].content as row,rowIndex}
                <tr>
                    <td>{row.nc}</td>
                    {#each row.detail as col,colIndex}
                    <td><input type=checkbox bind:checked={col.isCreate}></td>
                    {/each}
                </tr>
            {/each}
            </tbody>
        </table>

        <p><button onclick={save}>Save</button></p>
    {/snippet}
</Modal>
   
{#if status.view.list[status.view.index]==='Cycle'}
   
        <table class="small">
            <thead>
                <tr>
                    <th></th>
                    <th>id</th>
                    <th>yr</th>
                    <th>term</th>
                    <th>session</th>
                    <th>isActive</th>
                    <th>isPublish</th>

                </tr>
            </thead>
            <tbody>
            {#each status.cycle as row,rowIndex}
                <tr>
                    <th>
                        <a href={'javascript:void(0)'} data-title="EDIT CYCLE" onclick={()=>editContent(rowIndex)}>{@html icon.edit(24)}</a>
                    </th>
                    <td>{row.id}</td>
                    <td>{row.yr}</td>
                    <td>{row.period.term}</td>
                    <td>{row.period.session}</td>
                    <td><input type=checkbox bind:checked={row.isActive} onchange={()=>setActive(rowIndex)}></td>
                    <td><input type=checkbox bind:checked={row.isPublish} onchange={()=>setPublish(rowIndex)}></td>

                </tr>
            {/each}
        </tbody>
        </table>
        <p><a href={'javascript:void(0)'} data-title="ADD CYCLE" onclick={addCycle}>{@html icon.plusCircle(24)}</a></p>

    
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Edit'}
    <p>Edit</p>
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Print'}
    <p>Print</p>
    
{/if} <!-- / Edit -->

   
    
    

<style>

</style>