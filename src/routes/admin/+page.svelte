<script lang="ts">
import {goto} from '$app/navigation';
import {config,user,cohorts} from '$lib/state.svelte';
import {alert} from '$lib/state.svelte';
import * as assessment from '../assessments/assessment.svelte';
import * as util from '$lib/util';
import * as test from '$lib/intake_test';

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



const createIntake=async()=>{

    console.log(`test intake data`,test.intake);

    let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"intake_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
    console.log('2012 bare intake records',res);

    let d = [];
    for(const row of res) {
        let f=test.intake.filter(el=>el.nc===row.nc);
        if(f.length && f.length>0) {
            let x=util.random(0,f.length-1);
            console.log(row.sn,row.pid,x);
            row.base=f[x].base;
            row.pre=f[x].pre;
            console.log(row);
            d.push({id:row.id,base:f[x].base,pre:f[x].pre});
        } else console.log('ERROR WITH DATA',row.pid);



    }

    console.log(d);
    
    response = await fetch('/api/upsert', {
		method: 'POST',
		body: JSON.stringify({table:"intake_table",data:d}),
		headers: {'content-type': 'application/json'}
	});
	res= await response.json();
    



};

const addPre=async()=>{
    let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"pupil_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	const pupils= await response.json();
    
    response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:"intake_table",select:"*"}),
		headers: {'content-type': 'application/json'}
	});
	const i= await response.json();

    let d=[];

    for(const item of i.filter((el: { pre: null; })=>el.pre===null)) {
        let t=item.nc>11 ? 'A' : 'M';
        let p=pupils.find((el: { pid: any; yr: any; nc: any; })=>el.pid===item.pid && el.yr===item.yr && el.nc===item.nc);
        if(p) {
            let line:any={id:item.id,test:item.test!==null ? item.test : t,pre:[]};
            let x=util.random(0,p.length-1);
            console.log(item.pid,p.groups);
            for(const g of p.groups) {
                line.pre.push({sc:g.sc,ss:g.ss,A:g.pre.A,B:g.pre.B});
            }
            d.push(line);
        } else console.log('ERROR WITH DATA',item.pid);
    }

    console.log(d);

    response = await fetch('/api/upsert', {
		method: 'POST',
		body: JSON.stringify({table:"intake_table",data:d}),
		headers: {'content-type': 'application/json'}
	});
	const res= await response.json();
    console.log(d);

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


<article>
    <h4>Create Fake Intake Data</h4>
    <p class="notice">Careful - only run once!</p>
    <button disabled onclick={createIntake}>Create</button>
    <button  disabled onclick={addPre}>Add Preds</button>
</article>

<style>

</style>