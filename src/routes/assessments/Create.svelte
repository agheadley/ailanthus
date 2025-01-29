<script lang="ts">
import { user,config } from '$lib/state.svelte';
import {alert} from '$lib/state.svelte';
import * as util from '$lib/util';
import * as assessment from './assessment.svelte';

let { data = $bindable() } = $props();

let status = $state({
    n:'',
    dl:'',
    dt:0,
    max:12
});




let validate=():void=>{
    status.n=status.n.replace(/ /g,"_");
    status.n=status.n.replace(/[^A-Za-z0-9._-]/g,"");
    status.n = status.n.length && status.n.length>status.max ? status.n.slice(0,(status.max-1)) : status.n;
};

let create=async():Promise<void>=>{
   
    alert.ms=0;
    alert.msg = 'Creating Assessment ...';
   
    const res = await assessment.createAssessment(data.subject.yr,data.subject.nc,data.subject.sc,data.subject.ss,status.n,status.dl,false,false);
    //console.log(res);
    if(res.isOK===false) alert.type='error';
    alert.msg=res.msg;
    data.isUpdateRequired=true;
    data.isCreate=false;
    alert.ms=3000;
  
  

};

</script>


<p class="notice">EXAM {data.subject.yr} {data.subject.nc} {data.subject.sl} ({data.subject.sc})</p>


<p>
    <label for="n">Assessment Name</label>
    <input class={status.n==='' ?'error' : ''} id="n" type="text" name="n" bind:value={status.n}  oninput={validate}/>
</p>

<p>
    <label for="d">Assessment Date</label>
    <input  class={status.dl==='' ?'error' : ''} id="d" type="date" name="dl" bind:value={status.dl} />
</p>

<p>
    <button disabled={status.dl==='' || status.n===''} onclick={create}>Create</button>
    
</p>


<style>

</style>