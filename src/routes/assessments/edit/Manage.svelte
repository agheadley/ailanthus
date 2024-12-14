<script lang="ts">
import * as icon from '$lib/icon';
import { cohorts } from '$lib/state.svelte';

let { data = $bindable() } = $props();


let status:{n:string,max:number,gd:boolean[]}=$state({
    n:'',
    max:12,
    gd:[]
});
let validateName=()=>{
    status.n=status.n.replace(/ /g,"_");
    status.n=status.n.replace(/[^A-Za-z0-9._-]/g,"");
    status.n = status.n.length && status.n.length>status.max ? status.n.slice(0,(status.max-1)) : status.n;
    status.n = status.n==='' ? data.assessment.n : status.n; 


};

let removeSection=(rowIndex:number):void=>{

};

let validateGrade=(rowIndex:number):void=>{

};

$effect(()=>{
    status.n=data.assessment.n;
    status.gd=data.assessment.gd.map((el: any)=>true);
});

</script>

<p>
    <label for="name">Assessment Name</label>
    <input id="name" type=text bind:value={status.n} oninput={validateName}/>
</p>
<hr/>

    <div class="row top">
        <div class="col">
            <table class="small">
                <tbody>
                    <tr><th></th><th>Section</th><th>Total</th><th>Weighting</th></tr>
                    {#each data.assessment.t as row,rowIndex}
                        <tr>
                            <td>{#if rowIndex>0}<a href={'javascript:void(0)'} onclick={()=>removeSection(rowIndex)}>{@html icon.xCircle()}</a>{/if}</td>
                            
                            <td>{row.p}</td>
                            <td>{row.t}</td>
                            <td>{row.w}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            
        </div>
        <div class="col">
            <table class="small">
                <tbody>
                    <tr><th>Grade</th><th>Percentage</th></tr>
                    {#each data.assessment.gd as row,rowIndex}
                        <tr>
                            <td>{row.gd}</td>
                            <td><input disabled={!cohorts.edit.isEdit} type=number max=100 min=0 step=1 bind:value={row.pc} class={status.gd[rowIndex] ?'' : 'error'}  oninput={()=>validateGrade(rowIndex)}/></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>


<style>

</style>