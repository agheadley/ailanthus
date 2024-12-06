<script lang="ts">
import { user,config } from '$lib/state.svelte';
import {alert} from '$lib/state.svelte';
import * as util from '$lib/util';

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
    data.isCreate=false;
    alert.msg = 'Creating Assessment ...'

    let gradeArr=config.grade.filter(el=>el.sc===data.subject.sc).sort((a,b)=>b.pc-a.pc);

    let assessmentObj= {
      log:`${user.name}|${util.getDateTime()}`,
      nc:data.subject.nc,
      sc:data.subject.sc,
      ss:data.subject.ss,
      sl:data.subject.sl,
      n:status.n,
      dl:status.dl,
      dt:new Date(status.dl).getTime(),
      gd:gradeArr,
      t:[{t:100,w:100,p:"P1"}],
      isLock:false,
      isCore:false,
      isGrade:false,
      isArchive:false
    

    };

    let response = await fetch('/api/insert', {
		method: 'POST',
		body: JSON.stringify({table:"assessment_table",data:[assessmentObj]}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	
    let resultArr=[];
    if(res.data[0] && res.data[0]?.id>0) {
        for(let group of data.table) {
            for(let p of group.pupil) {
                let resultObj={
                    log:`${user.name}|${util.getDateTime()}`,
                    aid:res.data[0].id,
                    g:group.g,
                    t:[0],
                    gd:'U',
                    pc:0,
                    fb:'',
                    pid:p.pid,
                    sn:p.sn,
                    pn:p.pn
                };
                resultArr.push(resultObj)
            }
        }

        let response = await fetch('/api/insert', {
            method: 'POST',
            body: JSON.stringify({table:"result_table",data:resultArr}),
            headers: {'content-type': 'application/json'}
        });
        res= await response.json();
        
        if(res.data && res.data[0]?.id) {
            console.log(`CREATED 1 ASSESSMENT & ${res.data.length} RESULTS`);
            alert.msg=`CREATED 1 ASSESSMENT & ${res.data.length} RESULTS`;
        } else {
            console.log('ERROR result_table',res.error);
            alert.type='error';
            alert.msg='ERROR CREATING RESULTS';
        }


    } else {
        console.log('ERROR assessment_table',res.error);
        alert.type='error';
        alert.msg='ERROR CREATING ASSESSMENT';
    }
   


};

</script>


<p class="notice">{data.subject.nc} {data.subject.sl} ({data.subject.sc})</p>


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