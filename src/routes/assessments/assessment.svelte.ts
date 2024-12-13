import {config,cohorts,user} from '$lib/state.svelte';
import * as util from '$lib/util';



export const getGrade=(pc:number,gdArr:{gd:string,pc:number,sc:string,pre:number}[]):string=>{
    let result=gdArr[0] ? gdArr[0].gd : 'U';
    for(const item of gdArr.sort((a,b)=>a.pc-b.pc)) if(pc>=item.pc)  result=item.gd;
    return result;
};


export const getPercentage=(scoreArr:number[],tArr:{t:number,w:number,p:string}[]):number=>{
    
    const tw=tArr.filter(el=>el.t>0).map((/** @type {{ w: any; }} */ el)=>el.w).reduce((/** @type {any} */ a,/** @type {any} */ v)=>a+v);
    let pc=0;
    scoreArr.forEach((v,i)=>pc+=tArr[i].t>0 && tw>0 ? (v/tArr[i].t)*(tArr[i].w/tw) : 0);
    return Math.round(100*100*pc)/100;
};



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
    assessments:{id:number,nc:number,sc:string,ss:string,sl:string,n:string,dt:number,ds:string,isEdit:boolean,gd:string,r:number}[],
    pupil:{pid:number,sn:string,pn:string,overall:{A:number,B:number},results:{gd:string,r:number}[]}[],
    overall:{A:number,B:number}

};

// returns display table arr - one item for each group.
export const getTable=async (nc:number,sc:string,ss:string) : Promise<TableRow[]>=>{
    const table:TableRow[]=config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss)
        .map(el=>(
            {nc:nc,sc:sc,ss:ss,sl:el.sl,g:el.g,overall:{A:0,B:0},assessments:[],pupil:el.pupil.map(p=>(
                {pid:p.pid,sn:p.sn,pn:p.pn,
                    overall:{A:0,B:0},results:[]

                }))
        
        
    }));

    // get assessments and result
    const select=`select=id,nc,n,dl,dt,sc,ss,sl,log,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
    const filter=`nc=eq.${nc}&sc=eq.${sc}&ss=eq.${ss}&isArchive=eq.false`;
    const order=`order=dt.asc`;
    const response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:'assessment_table',select:select,filter:filter,order:order}),
        headers: {'content-type': 'application/json'}
    });
    const res= await response.json();

    // assess edit status isLock:false && tch of nc/subject or admin required.
    const gps = config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss);
    let tch=gps.flatMap(el=>el.teacher.map(t=>t.tid));
    if(user.isAdmin) tch.push(user.name);
    if(!(user.isAdmin || user.isTeacher)) tch=[];
    //console.log(tch);
   
    for(const g of table) {
        g.assessments=res.map((el: { id:number,nc: number; sc: string; ss: string; sl: string; n: string; dt: number;dl:string, isLock: boolean; })=>({id:el.id,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.sl,n:el.n,dt:el.dt,ds:util.getShortDate(el.dl),isEdit:tch.includes(user.name) && !el.isLock,gd:'',r:0}));
        // add pupil grades, intake data
        for(const p of g.pupil) {
            const f=config.pupils.find(el=>el.pid===p.pid);
            p.overall.A = f ? f.overall.A : 0;
            p.overall.B = f ? f.overall.B : 0;
            // add pupil results
            for(const col of res) {
                //console.log(col);
                const f=col.result_table.find((el: { pid: number; })=>el.pid===p.pid);
                p.results.push(f?{gd:f.gd,r:0}:{gd:'X',r:0});
                
            }
            for(let i=0;i<p.results.length;i++) 
                p.results[i].r=util.findGradeResidual(sc,p.results[0].gd,p.results[i].gd);
            

            
        }
        // calculate group average grades
        for(let i=0;i<g.assessments.length;i++) 
            g.assessments[i].gd=util.findAverageGrade(sc,g.pupil.map(el=>el.results[i].gd));
        // add residuals
        for(let i=0;i<g.assessments.length;i++) 
            g.assessments[i].r=util.findGradeResidual(sc, g.assessments[0].gd, g.assessments[i].gd);
        
        // intake overall averages
        const A = g.pupil.filter(el=>el.overall.A>0).map(el=>el.overall.A);
        const B = g.pupil.filter(el=>el.overall.B>0).map(el=>el.overall.B);
        if(A.length) g.overall.A = A.reduce((a,b) => a+b) / A.length;
        if(B.length) g.overall.B = B.reduce((a,b) => a+b) / B.length;
        
        


    }

    console.log('ASSESSMENT TABLE',table);

    return table;
};


interface EditTable  {
    assessment:{id:number,n:string,isLock:boolean,isGrade:boolean,gd:{gd:string,pc:number,sc:string,pre:number}[],t:{t:number,w:number,p:string}[]},
    results:{id:number|null,x:boolean,g:string,pid:number,pn:string,sn:string,t:number[],gd:string,pc:number,fb:string,pre:{A:number,B:number},overall:{A:number,B:number}}[],
    std:{A:string,B:string}
}

export const getEditTable=async():Promise<EditTable>=>{
    const select=`select=id,nc,n,dl,dt,sc,ss,sl,log,gd,t,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
    const filter=`id=eq.${cohorts.edit.id}`;
    
    const response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:'assessment_table',select:select,filter:filter}),
        headers: {'content-type': 'application/json'}
    });
    const res= await response.json();
    //console.log(res);

    const gps = config.groups.filter(el=>el.nc===cohorts.edit.nc && el.sc===cohorts.edit.sc && el.ss===cohorts.edit.ss);
    
    //console.log(gps);

    

    if(!res[0] || !gps[0]) return {std:{A:'',B:''},assessment:{id:0,n:'',isLock:true,isGrade:false,gd:[{sc:'',gd:'',pc:0,pre:0}],t:[{t:0,w:0,p:''}]},results:[]};

    const a = {id:res[0].id,n:res[0].n,isLock:res[0].isLock,isGrade:res[0].isGrade,gd:res[0].gd,t:res[0].t};

    
    const r=[];
    for(const g of gps) {
        for(const p of g.pupil) {
            const f=res[0].result_table.find((el: { pid: number; })=>el.pid===p.pid);
            if(f) console.log('FOUND RESULT ROW',p.pid);
            else console.log('MISSING ROW',p.pid);
            const t=a.t.map((el: number, i:  number)=>f?.t?.[i] ? f.t[i] : 0);
            const gd=f?f.gd : 'X';
            const fPupil = config.pupils.find(el=>el.pid===p.pid);
            const overall = fPupil ? {A:fPupil.overall.A,B:fPupil.overall.B} : {A:0,B:0};
            let pre = {A:0,B:0};
            if(fPupil) {
                const fPre=fPupil.groups.find(el=>el.nc===cohorts.edit.nc && el.sc===cohorts.edit.sc && el.ss===cohorts.edit.ss);
                if(fPre) pre = {A:fPre.pre.A,B:fPre.pre.B};
            }
            r.push({
                id:f?f.id:null,    // get from res[0]
                g:g.g,
                pid:p.pid,
                sn:p.sn,
                pn:p.pn,
                t:t,
                gd:gd,
                pc:f?f.pc:0,
                fb:f?f.fb:'',
                x:gd==='X' ? true : false,
                overall:overall,
                pre:pre
            });
        }
    }

    return {assessment:a,results:r,std:util.getStd(cohorts.edit.nc)};
    

};