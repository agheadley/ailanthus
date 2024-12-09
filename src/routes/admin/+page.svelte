<script lang="ts">
import {goto} from '$app/navigation';
import {config,user,cohorts} from '$lib/state.svelte';
import {alert} from '$lib/state.svelte';
import * as assessment from '$lib/assessment.svelte';
import * as util from '$lib/util';

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
   
    let arr= util.unique(config.groups.filter(el=>el.nc===cohorts.nc.list[status.ncIndex].nc).map(el=>({nc:el.nc,sc:el.sc,ss:el.ss})),['nc','sc','ss']);
    console.log(arr);
    if(arr[0]) {
        alert.msg=`found ${arr.length} subjects for yeargroup ${cohorts.nc.list[status.ncIndex].nc} ( ${status.isGrade ? 'grade only' : 'grades & scores'} )`;
        util.wait(3000);

        for(const item of arr) {
            alert.msg=`CREATING SUBJECT ${item.ss} (${item.sc})`;
            util.wait(1000);
            const res = await assessment.createAssessment(Number(item.nc),String(item.sc),String(item.ss),status.n,status.dl,status.isGrade,true);
            console.log(res);
            if(res.isOK===false) alert.type='error';
            alert.msg=res.msg;
            util.wait(2000);
        }
    } else {
        alert.type='error';
        alert.msg='no groups found';
    }

};






$effect(() => {
    if(config.isReady===false || user.isAdmin===false) goto(`/`);
            
});

</script>

<svelte:head>
    <title>Admin</title>
    <meta name="description" content="ailanthus" />
</svelte:head>





<article>
    <notice>Create Core Assessment for Yeargroup</notice>
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