<script lang="ts">

let status = $state({
    view:{index:0,list:['Cycle','Edit','Print']},
    cycle:[],


    // get data from config
    yr:{list:[],index:0},
    ay:'',
    term:{list:['Winter','Spring','Summer'],index:0},
    session:{list:['1st','2nd'],index:0}


});

const readCycle=async()=>{
    const response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:"cycle_table",select:"*"}),
        headers: {'content-type': 'application/json'}
    });
    status.cycle= await response.json();
    // get data from config state.svelte
};

const setup = async()=>{
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
    
    
   
{#if status.view.list[status.view.index]==='Cycle'}
    <p>Cycle</p>
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Edit'}
    <p>Edit</p>
    
{/if} <!-- / Edit -->

{#if status.view.list[status.view.index]==='Print'}
    <p>Print</p>
    
{/if} <!-- / Edit -->

   
    
    

<style>

</style>