<script lang="ts">

import * as util from '$lib/util';
import {alert,cohorts,config} from '$lib/state.svelte';
import * as assessment from './../assessments/assessment.svelte';

let status = $state({
    n:'',
    dl:'',
    dt:0,
    isGrade:false,
    max:12,
    ncIndex:0
  

});



let validate=():void=>{
    status.n=status.n.replace(/ /g,"_");
    status.n=status.n.replace(/[^A-Za-z0-9._-]/g,"");
    status.n = status.n.length && status.n.length>status.max ? status.n.slice(0,(status.max-1)) : status.n;
};

let create=async():Promise<void>=>{
   
    alert.ms=0;
    let arr= util.unique(config.groups.filter(el=>el.nc===cohorts.nc.list[status.ncIndex].nc).map(el=>({yr:Number(el.yr),nc:el.nc,sc:el.sc,ss:el.ss})),['nc','sc','ss']);
    console.log(arr);
    if(arr[0]) {
        alert.msg=`found ${arr.length} subjects for yeargroup ${cohorts.nc.list[status.ncIndex].nc} ( ${status.isGrade ? 'grade only' : 'grades & scores'} )`;
        util.wait(3000);

        for(const item of arr) {
            alert.msg=`CREATING SUBJECT ${item.ss} (${item.sc})`;
            util.wait(1000);
            const res = await assessment.createAssessment(Number(item.yr),Number(item.nc),String(item.sc),String(item.ss),status.n,status.dl,status.isGrade,true);
            console.log(res);
            if(res.isOK===false) alert.type='error';
            alert.msg=res.msg;
            util.wait(2000);
        }
    } else {
        alert.type='error';
        alert.msg='no groups found';
    }
    alert.ms=3000;

};



    $effect(() => {
       
                
    });
    
    </script>
    
    <article>
        <p class="notice">Create Core Assessment for Yeargroup</p>
        <p>
            <select bind:value={status.ncIndex}>
                {#each cohorts.nc.list as row,index}
                <option value={index}>{row.nc}</option>
                {/each}
            </select>
        </p>
        <p>
            <label for="n">Assessment Name</label>
            <input class={status.n==='' ?'error' : ''} id="n" type="text" name="n" bind:value={status.n}  oninput={validate}/>
        </p>
        
        <p>
            <label for="d">Assessment Date</label>
            <input  class={status.dl==='' ?'error' : ''} id="d" type="date" name="dl" bind:value={status.dl} />
        </p>
        <p>
            <label for="g">Grade only (no scores)</label>
            <input id='g' type=checkbox bind:checked={status.isGrade}/>
        </p>
        
        <p>
            <button disabled={status.dl==='' || status.n===''} onclick={create}>Create</button>
            
        </p>
    </article>
    
    <style>
    
    </style>