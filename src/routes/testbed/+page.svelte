<script lang="ts">


import * as util from '$lib/util';
import * as file from '$lib/file';
import {alert} from '$lib/state.svelte';
import Modal from '$lib/_Modal.svelte';
import * as chart from '$lib/chart';

let imageUrls=$state({public:'',private:''});

let readData:any=$state({});


let size = $state(2);
let color = $state({r:34,g:127,b:34,o:0.1});
let canvas:any;

let modalOpen:boolean = $state(false);

//let { data } = $props();


let files:any=$state();


let pupil : {log:string,pid:number,mid:string,sn:string,pn:string,gnd:string,hse:string,tg:string,nc:number
			overall:{A:number,B:number},base:{type:string,A:number,B:number}[],groups:{nc:number,sc:string,ss:string,g:string,pre:{A:number,B:number}}[]	}[]
	= [];

let group:  {	nc:number,sc:string,ss:string,sl:string,g:string,log:string,
				pupil:{pid:number,nc:number,sn:string,pn:string,gnd:string,hse:string}[],teacher:{tid:string,sal:string}[]}[] 
			=[];


let edgeRead=async()=>{
	const select=`select=id,nc,n,dl,dt,sc,ss,sl,log,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
	const filter=`isArchive=eq.false&nc=eq.13&ss=eq.Eli&sc=eq.A`;
	const order=`order=dt.asc`;

	let response = await fetch('/edge/read', {
		method: 'POST',
		body: JSON.stringify({table:'assessment_table',filter:filter,select:select,order:order}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log('edgeRead',res);
};




let insertGroup=async()=>{
	console.log('INSERTING : ',group);
	let response = await fetch('/api/insert', {
		method: 'POST',
		body: JSON.stringify({table:"group_table",data:group}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log('INSERT',res);
};


let insertPupil=async()=>{
	console.log('INSERTING : ',group);
	let response = await fetch('/api/insert', {
		method: 'POST',
		body: JSON.stringify({table:"pupil_table",data:pupil}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log('INSERT',res);
};

let upsert = async()=>{
	let response = await fetch('/api/upsert', {
		method: 'POST',
		body: JSON.stringify({table:"test_table",data:[{id:1,age:15},{age:25}]}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();
	console.log('UPSERT',res);


};

let getGroup=(results:any)=>{


	group  = [];

	//console.log(typeof results);
	for(let row of results) {
		if(!group.find((el: { sc: any; ss: any; g: any; nc:any;})=>el.sc===row.sc && el.ss===row.ss && el.nc===Number(row.g_nc) && el.g===row.g)) {
			group.push({
				nc:Number(row.g_nc),
				sc:row.sc,
				ss:row.ss,
				sl:row.sl,
				g:row.g,
				pupil:[],
				teacher:[],
				log:util.getDate()
			});
		}
	}

	console.log(group);

	
	for(let row of group) {
		let f=results.filter((el: { g: string; g_nc: number; type: string; })=>el.g===row.g && Number(el.g_nc)===row.nc && el.type==='pupil');
		f = f ? 
			f.sort((a: { sn: string; pn: string; },b: { sn: any; pn: any; })=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn)).map((el: { pid: any; pupil_nc: any; pn: any; sn: any; gnd: any; hse: any; })=>({pid:Number(el.pid),nc:Number(el.pupil_nc),pn:el.pn,sn:el.sn,gnd:el.gnd,hse:el.hse})) 
			: [];
		f = util.unique(f,['pid']);
		row.pupil=f;
	}

	

	for(let row of group) {
		let f=results.filter((el: { g: string; g_nc: number; type: string; })=>el.g===row.g && Number(el.g_nc)===row.nc && el.type==='teacher');
		f = f ? 
			f.sort((a: { sn: string; pn: string; },b: { sn: any; pn: any; })=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn)).map((el: { tid: any; sal: any; })=>({tid:el.tid,sal:el.sal})) 
			: [];
		f = util.unique(f,['tid']);
		row.teacher=f;
	}

	console.log(group);

	group=group.filter(el=>el.g!==null);

	console.log(group);



	
};



let getPupil=async(results:any)=>{
	pupil=[];
	for (let row of results.filter((el: { type: string; })=>el.type==='pupil')) {
		if(!pupil.find(el=>el.pid===Number(row.pid))) {

			let x = util.random(70,135);

			let base = [
				{type:'overall',A:x+util.random(-5,5),B:x+util.random(-10,5)},
				{type:'math',A:x+util.random(-10,10),B:x+util.random(-10,5)},
				{type:'vocab',A:x+util.random(-5,5),B:x+util.random(-10,5)},
				{type:'nonVerbal',A:x+util.random(-5,5),B:x+util.random(-10,5)}
			];

			if(row.pupil_nc>11) {
				let x=util.random(4,8)+util.random(0,10)/10;
				let y=x*16;
				base = [
					{type:'overall',A:x,B:y+util.random(-10,5)},
					{type:'math',A:0,B:y+util.random(-10,5)},
					{type:'vocab',A:0,B:y+util.random(-10,5)},
					{type:'nonVerbal',A:0,B:y+util.random(-10,5)}
				];

			}

			let f=base.find(el=>el.type==='overall');			
			let overall = f ? {A:f.A,B:f.B} : {A:0,B:0};





			
			
			let g = results.filter((el: { pid: any; })=>el.pid===row.pid).map((el: {
				g_nc: any; nc:any; ss: any; sc: any; g: any; 
                })=>({nc:Number(el.g_nc),ss:el.ss,sc:el.sc,g:el.g}));
			
			
			
			let gs:{nc:number,sc:string,ss:string,g:string,pre:{A:number,B:number}}[]=[];

			for(let gp of g) {
				if(row.pupil_nc<12) {
					gs.push({nc:gp.nc,sc:gp.sc,ss:gp.ss,g:gp.g,pre:{A:overall.A/16+util.random(-5,5)/10,B:overall.B/16+util.random(-5,5)/10}});
				} else {
					if(gp.sc==='I') {
						let a=util.random(0,5)/10 + 7*overall.A/9;
						let b=util.random(0,5)/10 + 7*overall.B/(9*16);
						gs.push({nc:gp.nc,sc:gp.sc,ss:gp.ss,g:gp.g,pre:{A:a,B:b}});
					} else {
						gs.push({nc:gp.nc,sc:gp.sc,ss:gp.ss,g:gp.g,pre:{A:overall.A*16+util.random(-5,5)/10,B:overall.B+util.random(-5,5)/10}});
					}
				}
			}
			pupil.push ({
				log:util.getDate(),
				pid:Number(row.pid),
				mid:row.mid,
				nc:Number(row.pupil_nc),
				sn:row.sn,
				pn:row.pn,
				gnd:row.gnd,
				hse:row.hse,
				tg:row.tg,
				overall:overall,
				base:base,
				groups:gs
			});
		}
	}

	console.log(pupil);


};

let upload=async()=>{
    
    let res:any= await file.readFile(files[0]);

    let results:object[]=file.csvProcess(res);
    console.log(results);

    getGroup(results);
    getPupil(results);

    await insertGroup();
    await insertPupil();


};





let getPublicImageUrl=async()=>{
    let response = await fetch('/api/storage/public', {
		    method: 'POST',
		    body: JSON.stringify({fileName:'download.svg'}),
		    headers: {'content-type': 'application/json'}
	    });
    let res= await response.json();
    console.log(res);
    imageUrls.public=res.url ? res.url : '';
};


let getPrivateImageUrl=async()=>{
    let response = await fetch('/api/storage/private', {
		    method: 'POST',
		    body: JSON.stringify({fileName:'user.svg'}),
		    headers: {'content-type': 'application/json'}
	    });
    let res= await response.json();
    console.log(res);
    imageUrls.private=res.url ? res.url : '';
};


let read=async()=>{
		let response = await fetch('/api/read', {
		    method: 'POST',
		    body: JSON.stringify({table:"counties"}),
		    headers: {'content-type': 'application/json'}
	    });
		readData= await response.json();
		console.log($state.snapshot(readData));
		
};

let openAlert=()=>{
	alert.msg='Hello World!';
};



$effect(() => {
    $inspect('$effect',color,size);
    const context= canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // this will re-run whenever `color` or `size` change
    context.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.o})`;
    context.fillRect(0, 0, size, size);
});

</script>

<svelte:head>
    <title>Testbed</title>
    <meta name="description" content="ailanthus" />
</svelte:head>

<article>
	<h4>Test VA Chart</h4>
	<p>{@html chart.getVA({n:5,v:0.91,s:2})}</p>
	<p>{@html chart.getVA({n:21,v:-0.71,s:3})}</p>
	<p>{@html chart.getVA({n:145,v:0.12,s:0})}</p>
	<p>{@html chart.getVA({n:5,v:0.80,s:0})}</p>
</article>


<article>
	<h4>Edge Read</h4>
	<p><button onclick={edgeRead}>Read</button></p>
	
</article>




<article>
	<h4>Upsert</h4>
	<p><button onclick={upsert}>Upsert</button></p>
</article>

<article>
    <h4>Supabase Storage Buckets</h4>
    <p>
        <button onclick={getPublicImageUrl}>Get Public Image URL</button>
        {#if imageUrls.public!==''}<img src={imageUrls.public} alt='images'/>{:else}Click to load ...{/if}
    </p>
    <p>public URLs are open by default</p>
    
    <p>
        <button onclick={getPrivateImageUrl}>Get Private Image URL</button>
        {#if imageUrls.private!==''}<img src={imageUrls.private} alt='images'/>{:else}Click to load ...{/if}
    </p>

    <p><a href="https://supabase.com/dashboard/project/iwwsyzhjxrgrpztmpixv/storage/policies" target="_blank">Setting createSignedUrl() access</a></p>
</article>


<article>
    <h4>Getting Started - Select *</h4>
    <div>
		<p><button onclick={read}>Read Data</button></p>
        {#if readData}
		<ul>
			{#each readData as row}
			  <li>{row.group_table.g} {row.person_table.nc} {row.person_table.sn} {row.person_table.pn}</li>
			{/each}
		  </ul>
        {:else} 
            Click to read ...
        {/if}
	</div>
	<p><a href="https://vercel.com/anthony-headleys-projects/ailanthus/stores/integration/store_P2rwINOj7ZEjiSo0/guides" target=”_blank”>Getting Started</a></p>
    <p><a href="https://supabase.com/dashboard/project/iwwsyzhjxrgrpztmpixv/auth/policies?search=32670&schema=public" target="_blank">Needs a public policy to read, only returns 1000 rows!</a></p>
</article>


<article>
    <h4>$effect()</h4>
    <div>
        <canvas style="border:1px solid black;" bind:this={canvas} width="100" height="100"></canvas>
        <p>
            <button onclick={()=>size+=2}>Increment</button>
            <button onclick={()=>size-=2}>Decrement</button>
            <button onclick={()=>color.o+=0.05}>Color</button>
        </p>
    </div>
</article>

<article>
    <h2>Alert & Modal</h2>
    <div>
        <p><button onclick={openAlert}>Alert</button></p>
	</div>
    <div>
        <p><button onclick={()=>modalOpen=true}>Modal</button></p>
    </div>
    <div>
        <Modal bind:open={modalOpen} title="Test Modal">
           <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
           </p>
        </Modal>
    </div>
</article>

<article>
    <h2>Process table data</h2>
    <p> <input name="file1" type="file" bind:files /></p>
    <p> <button disabled='{!files}' class="button dark" onclick={upload}>Upload</button></p>
</article>    


<style>


</style>