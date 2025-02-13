<script lang="ts">
import {config,cohorts,alert} from '$lib/state.svelte';
import Modal from '$lib/_Modal.svelte';
import * as icon from '$lib/icon'


interface Cycle {
    id:number,
    created_at:string,
    yr:number,
    period:{term:string,session:string,ay:string},
    content:{fm:number,detail:{type:string,isCreate:boolean}[]}[],
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
    types:['hod','teacher','enrichment','tutor','hm','sa','slt'],
    isContent:false,
    cycleIndex:0

});

/*
term:['Winter','Spring','Summer'],
      session:['1st','2nd'],
      effort:{types:['Class','Prep'],default:3,values:[{txt:'4',value:4},{txt:'3',value:3},{txt:'2',value:2},{txt:'1',value:1},{txt:'N/A',value:null}]},
      length:{A:{min:180,max:600},P:{min:300,max:800},E:{min:300,max:800}},
*/

const addCycle=async()=>{

};

const editContent=(index:number)=>{
    status.cycleIndex=index;
    status.isContent=true;
};

const readCycle=async()=>{
    let response = await fetch('/edge/read', {
            method: 'POST',
            body: JSON.stringify({table:'cycle_table',select:'*'}),
            headers: {'content-type': 'application/json'}
    });   
    status.cycle= await response.json();
   
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
        <p>xyz</p>
    {/snippet}
</Modal>
   
{#if status.view.list[status.view.index]==='Cycle'}
    <figure>
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
                    <td>{row.yr}</td>
                    <td>{row.period.term}</td>
                    <td>{row.period.session}</td>
                    <td>{row.isActive}</td>
                    <td>{row.isPublish}</td>

                </tr>
            {/each}
        </tbody>
        </table>
        <p><a href={'javascript:void(0)'} data-title="ADD CYCLE" onclick={addCycle}>{@html icon.plusCircle(24)}</a></p>
    </figure>
    
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Edit'}
    <p>Edit</p>
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Print'}
    <p>Print</p>
    
{/if} <!-- / Edit -->

   
    
    

<style>

</style>