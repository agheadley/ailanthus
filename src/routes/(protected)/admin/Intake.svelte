<script lang="ts">

/*  
const createIntake=async()=>{



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
*/

    $effect(() => {
       
                
    });
    
    </script>
    <!--
    <article>
        <h4>Create Fake Intake Data</h4>
        <p class="notice">Careful - only run once!</p>
        <button disabled onclick={createIntake}>Create</button>
        <button  disabled onclick={addPre}>Add Preds</button>
    </article>
    -->
    
    <style>
    
    </style>