<script lang="ts">
import * as icon from '$lib/icon';
import { cohorts } from '$lib/state.svelte';

let { data = $bindable() } = $props();





let removeSection=(rowIndex:number):void=>{
    data.assessment.t.pop();
};

let addSection=():void=>{
    let x=data.assessment?.t?.length ? data.assessment.t.length+1 : 0;
    data.assessment.t.push({p:x>0?`P${x}`:'Px',t:100,w:100});
};

let validateTotal=(rowIndex:number):void=>{
        data.assessment.t[rowIndex].p = data.assessment.t[rowIndex].p.replace(/\W+/g, " ");
        data.assessment.t[rowIndex].p = data.assessment.t[rowIndex].p.length && data.assessment.t[rowIndex].p.length>data.manage.max ? data.assessment.t[rowIndex].p.slice(0,(data.manage.max-1)) : data.assessment.t[rowIndex].p;
        data.assessment.t[rowIndex].p = data.assessment.t[rowIndex].p==='' ?  data.assessment?.t?.length ? `P${rowIndex+1}`: 'Px' : data.assessment.t[rowIndex].p;

        let x=data.assessment.t[rowIndex].t>=0 ? data.assessment.t[rowIndex].t : 0;
        data.assessment.t[rowIndex].t=Math.round(x);
        x=data.assessment.t[rowIndex].w>=0 ? data.assessment.t[rowIndex].w : 0;
        data.assessment.t[rowIndex].w=Math.round(x);
};

let validateGrade=(rowIndex:number):void=>{

    let x=data.assessment.gd[rowIndex].pc>=0 ? data.assessment.gd[rowIndex].pc : 0;
    x = x>100 ? 100 : x;
    data.assessment.gd[rowIndex].pc=Math.round(100*x)/100;

       
    data.manage.gd = data.manage.gd.map((el: any)=>true);
    data.manage.isValid=true;

    let currentValue=100;
    for(let i=0;i<data.assessment.gd.length;i++) {
        if(i>0) {
            if(data.assessment.gd[i].pc >= currentValue) data.manage.gd[i]=false;
        } else  {
            if(data.assessment.gd[i].pc > currentValue) data.manage.gd[i]=false;
        }
        currentValue= data.assessment.gd[i].pc;

    }

    data.manage.isValid = data.manage.gd.includes(false) ? false : true;
};

$effect(()=>{
    data.manage.n=data.assessment.n;
    data.manage.gd=data.assessment.gd.map((el: any)=>true);
});

</script>


    <div class="row top">
        <div class="col">
            <table class="small">
                <tbody>
                    <tr><th></th><th>Section</th><th>Total</th><th>Weighting</th></tr>
                    {#each data.assessment.t as row,rowIndex}
                        <tr>
                            <td>{#if rowIndex>0 && cohorts.edit.isEdit}<a href={'javascript:void(0)'} onclick={()=>removeSection(rowIndex)}>{@html icon.xCircle()}</a>{/if}</td>

                            <td><input disabled={!cohorts.edit.isEdit}  type=text bind:value={row.p}  oninput={()=>validateTotal(rowIndex)}/></td>
                            <td><input  class="score"  disabled={!cohorts.edit.isEdit}  type=number min=0 step=1 bind:value={row.t} oninput={()=>validateTotal(rowIndex)}/></td>
                            <td><input  class="score"  disabled={!cohorts.edit.isEdit}   type=number min=0 step=1 bind:value={row.w}  oninput={()=>validateTotal(rowIndex)}/></td>
                           
                        </tr>
                    {/each}
                </tbody>
            </table>
            <p>{#if cohorts.edit.isEdit}<a href={'javascript:void(0)'} onclick={addSection}>{@html icon.plusCircle()}</a>{/if}</p>
        </div>
        <div class="col">
            <table class="small">
                <tbody>
                    <tr><th>Grade</th><th>Percentage</th></tr>
                    {#each data.assessment.gd as row,rowIndex}
                        <tr>
                            <td>{row.gd}</td>
                            <td><input disabled={!cohorts.edit.isEdit} type=number max=100 min=0 step=1 bind:value={row.pc} class={data.manage.gd[rowIndex] ?'score' : 'score error'}  oninput={()=>validateGrade(rowIndex)}/></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>


<style>

.score {
    width:4rem;
    max-width:4rem;
    -moz-appearance: textfield;
    appearance: textfield;
    
}


</style>