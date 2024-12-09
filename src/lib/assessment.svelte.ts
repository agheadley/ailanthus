import {config,user} from '$lib/state.svelte';
import * as util from '$lib/util';

export const createAssessment=async(nc:number,sc:string,ss:string,n:string,dl:string,isGrade:boolean,isCore:boolean):Promise<{isOK:boolean,msg:string}>=>{


    console.log('assessment.create()');


    const gps = config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss);
    console.log('found groups ',gps);

    if(!gps?.[0]) return {isOK:false,msg:'error finding groups'};

    const gradeArr=config.grade.filter(el=>el.sc===sc).sort((a,b)=>b.pc-a.pc);

    const assessmentObj= {
        log:`${user.name}|${util.getDateTime()}`,
        nc:nc,
        sc:sc,
        ss:ss,
        sl:gps[0].sl,
        n:n,
        dl:dl,
        dt:new Date(dl).getTime(),
        gd:gradeArr,
        t:[{t:100,w:100,p:"P1"}],
        isLock:false,
        isCore:isCore,
        isGrade:isGrade,
        isArchive:false
      };
  
      let response = await fetch('/api/insert', {
          method: 'POST',
          body: JSON.stringify({table:"assessment_table",data:[assessmentObj]}),
          headers: {'content-type': 'application/json'}
      });
      let res= await response.json();

      if(!res?.data[0]?.id || res.data[0].id<1) return {isOK:false,msg:'error insertinmg assessment'};

      const resultArr=[];
      for(const group of gps) {
        for(const p of group.pupil) {
            const resultObj={
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

    response = await fetch('/api/insert', {
        method: 'POST',
        body: JSON.stringify({table:"result_table",data:resultArr}),
        headers: {'content-type': 'application/json'}
    });
    res= await response.json();

    if(!res?.data[0]?.id || res.data[0].id<1) return {isOK:false,msg:'error inserting results'}

    return {isOK:true,msg:`CREATED 1 ASSESSMENT & ${res.data.length} RESULTS`} 

};


interface TableRow {
    nc:number,
    sc:string,
    ss:string,
    sl:string,
    g:string,
    assessments:{nc:number,sc:string,ss:string,sl:string,n:string,dt:number,ds:string,isEdit:boolean}[],
    pupil:{pid:number,sn:string,pn:string,overall:{A:number,B:number},results:{gd:string}[]}[]

};

// returns display table arr - one item for each group.
export const getTable=async (nc:number,sc:string,ss:string) : Promise<TableRow[]>=>{
    const table:TableRow[]=config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss)
        .map(el=>(
            {nc:nc,sc:sc,ss:ss,sl:el.sl,g:el.g,assessments:[],pupil:el.pupil.map(p=>(
                {pid:p.pid,sn:p.sn,pn:p.pn,
                    overall:{A:0,B:0},results:[]

                }))
        
        
    }));

    // get assessments and result
    let response = await fetch('/api/readAssessment', {
		method: 'POST',
		body: JSON.stringify({type:'subject',nc:nc,sc:sc,ss:ss,isArchive:false}),
		headers: {'content-type': 'application/json'}
	});
	let res= await response.json();

    // assess edit status isLock:false && tch of nc/subject or admin required.
    let gps = config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss);
    let tch=gps.flatMap(el=>el.teacher.map(t=>t.tid));
    if(user.isAdmin) tch.push(user.name);
    if(!(user.isAdmin || user.isTeacher)) tch=[];
    //console.log(tch);
   
    for(const g of table) {
        g.assessments=res.map((el: { nc: any; sc: any; ss: any; sl: any; n: any; dt: any; isLock: any; })=>({nc:el.nc,sc:el.sc,ss:el.ss,sl:el.sl,n:el.n,dt:el.dt,ds:'',isEdit:tch.includes(user.name) && !el.isLock}));
        for(const p of g.pupil) {
            const f=config.pupils.find(el=>el.pid===p.pid);
            p.overall.A = f ? f.overall.A : 0;
            p.overall.B = f ? f.overall.B : 0;
            // add pupil results
            
        }
    }

    console.log(table);

    return table;
};

export const getStd=(nc:number):{A:string,B:string}=>{
    const f=config.std.find(el=>el.nc===nc);
    return f ? {A:f.A,B:f.B} : {A:'',B:''};
}