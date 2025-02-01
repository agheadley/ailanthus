import {config,cohorts,user} from '$lib/state.svelte';
import * as util from '$lib/util';
import type {IntakeTable} from '$lib/_db';


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



export const createAssessment=async(yr:number,nc:number,sc:string,ss:string,n:string,dl:string,isGrade:boolean,isCore:boolean):Promise<{isOK:boolean,msg:string}>=>{


    console.log('assessment.create()');
    //console.log('nc',nc,'yr',yr);

    const gps = config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss);
    console.log('found groups ',gps);

    if(!gps?.[0]) return {isOK:false,msg:'error finding groups'};

    const gradeArr=config.grade.filter(el=>el.sc===sc).sort((a,b)=>b.pc-a.pc);

    const assessmentObj= {
        log:`${user.name}|${util.getDateTime()}`,
        nc:nc,
        yr:yr,   //util.getExamYear(nc),
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
        isGrade:isGrade
      };
      //console.log(assessmentObj);
  
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
    nc?:number,
    sc?:string,
    ss?:string,
    sl?:string,
    g?:string,
    assessments:{id:number,yr:number,nc:number,sc:string,ss:string,sl:string,n:string,dt:number,ds:string,isEdit:boolean,gd:string,r:number}[],
    pupil:{pid:number,sn:string,pn:string,overall:{A:number,B:number}, pre?:{A:number,B:number,sc?:string,ss?:string},results:{gd:string,r:number}[]}[],
    overall?:{A:number,B:number}

};


export const getArchiveTable = async (yr:number,nc:number,sc:string,ss:string) : Promise<TableRow>=>{

    const table:TableRow= {
        assessments:[],
        pupil:[]
    }


    const select=`select=id,nc,yr,n,dl,dt,sc,ss,sl,log,gd,t,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
    const filter=`nc=eq.${nc}&yr=eq.${yr}&sc=eq.${sc}&ss=eq.${ss}`;

    let response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:'assessment_table',select:select,filter:filter}),
        headers: {'content-type': 'application/json'}
    });
    const res= await response.json();
    table.assessments =res.map((el: { id: number; n: string; dl: string; dt: number;  sc: string; sl: string; nc: number; yr: number;t:{p:string,t:number,w:number}[],gd:{sc:string,gd:string,pc:number,pre:number}[] })=>({id:el.id,n:el.n,ds:util.getShortDate(el.dl),dt:el.dt,t:el.t,sc:el.sc,ss:el.sc,sl:el.sl,nc:el.nc,yr:el.yr,gd:el.gd,r:0,isEdit:false}))
        .sort((a: { dt: number; },b: { dt: number; })=>a.dt-b.dt);

    //console.log(table);
    //console.log(res);

    let  pupils = res.map((el: { result_table: {id:number,log:string,aid:number,g:string,t:number[],gd:string,pc:number,fb:string,pid:number,sn:string,pn:string}[] })=>el.result_table).flat().map((el: { pid: number; sn: string; pn: string; })=>({pid:el.pid,sn:el.sn,pn:el.pn}));
    pupils = util.unique(pupils,['pid']);

    table.pupil=pupils.map((el: { pid: number; sn: string; pn: string; })=>({pid:el.pid,sn:el.sn,pn:el.pn,overall:{A:0,B:0},pre:{A:0,B:0},results:[]}))
        .sort((a: { sn: string; pn: string; },b: { sn: string; pn: string; })=>a.sn.localeCompare(b.sn)-a.pn.localeCompare(b.pn));

    
    response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:"intake_table",select:"*",filter:`yr=eq.${cohorts.archive.subjects[cohorts.archive.sIndex].yr}&nc=eq.${cohorts.archive.subjects[cohorts.archive.sIndex].nc}`}),
        headers: {'content-type': 'application/json'}
    });
    const i:IntakeTable[]= await response.json();

    //console.log(i);
    const overall : {pid:number,type:string,A:number|null,B:number|null}[]= i.filter(el=>el.base!==null).map((el)=>el.base.map((b)=>({pid:el.pid,type:b.type,A:b.A,B:b.B})))
    .flat().filter((el: { type: string; })=>el.type==="overall");

    const pre:{pid:number,A:number|null,B:number|null,sc:string,ss:string}[]= i.filter(el=>el.pre!==null).map(el=>el.pre.map((b)=>({pid:el.pid,sc:b.sc,ss:b.ss,A:b.A,B:b.B})))
    .flat().filter(el=>el.sc===sc && el.ss===ss);
    //const pre:{pid:number,A:number|null,B:number|null,sc:string,ss:string}[]=[];

    //console.log(overall,pre);

    
    for(const p of table.pupil) {
        p.overall.A = overall.find((el: { pid: number; })=>el.pid===p.pid)?.A || 0;
        p.overall.B = overall.find((el: { pid: number; })=>el.pid===p.pid)?.B || 0;
        p.pre = p.pre || { A: 0, B: 0 };
        p.pre.A = pre.find((el: { pid: number; })=>el.pid===p.pid)?.A || 0;
        p.pre.B = pre.find((el: { pid: number; })=>el.pid===p.pid)?.B || 0;
        
    };

    
    for(const p of table.pupil) {
        for(const a of table.assessments) {
            const f=res.find((el: { id: number; })=>el.id===a.id);
            const r=f?.result_table.find((el: { pid: number; })=>el.pid===p.pid);
            p.results.push(r?{gd:r.gd,r:0}:{gd:'X',r:0});
        }
        for(let i=0;i<p.results.length;i++) 
            p.results[i].r=util.findGradeResidual(sc,p.results[0].gd,p.results[i].gd);
    }

    //console.log(table);


    return table;
    
};


// returns display table arr - one item for each group.
export const getTable=async (yr:number,nc:number,sc:string,ss:string) : Promise<TableRow[]>=>{
    const table:TableRow[]=config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss)
        .map(el=>(
            {nc:nc,sc:sc,ss:ss,sl:el.sl,g:el.g,overall:{A:0,B:0},assessments:[],pupil:el.pupil.map(p=>(
                {pid:p.pid,sn:p.sn,pn:p.pn,
                    overall:{A:0,B:0},results:[]

                }))
        
        
    }));

    // get assessments and result
    const select=`select=id,nc,yr,n,dl,dt,sc,ss,sl,log,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;
    const filter=`yr=eq.${yr}&nc=eq.${nc}&sc=eq.${sc}&ss=eq.${ss}`;
    const order=`order=dt.asc`;
    const response = await fetch('/edge/read', {
        method: 'POST',
        body: JSON.stringify({table:'assessment_table',select:select,filter:filter,order:order}),
        headers: {'content-type': 'application/json'}
    });
    const res= await response.json();

    console.log(res);

    // assess edit status isLock:false && tch of nc/subject or admin required.
    const gps = config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss);
    let tch=gps.flatMap(el=>el.teacher.map(t=>t.tid));
    if(user.isAdmin) tch.push(user.name);
    if(!(user.isAdmin || user.isTeacher)) tch=[];
    //console.log(tch);
   
    for(const g of table) {
        g.assessments=res.map((el: { id: number; yr: number; nc: number; sc: string; ss: string; sl: string; n: string; dt: number; dl: string; isLock: boolean; })=>({id:el.id,yr:el.yr,nc:el.nc,sc:el.sc,ss:el.ss,sl:el.sl,n:el.n,dt:el.dt,ds:util.getShortDate(el.dl),isEdit:tch.includes(user.name) && !el.isLock,gd:'',r:0}));
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
        g.overall!.A = A.length ? A.reduce((a,b) => a+b) / A.length : 0;
        g.overall!.B = B.length ? B.reduce((a,b) => a+b) / B.length : 0;
        
        


    }

    console.log('ASSESSMENT TABLE',table);

    return table;
};


interface EditTable  {
    assessment:{id:number,n:string,isCore:boolean,isLock:boolean,isGrade:boolean,gd:{gd:string,pc:number,sc:string,pre:number}[],t:{t:number,w:number,p:string}[]},
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

    

    if(!res[0] || !gps[0]) return {std:{A:'',B:''},assessment:{id:0,n:'',isCore:false,isLock:true,isGrade:false,gd:[{sc:'',gd:'',pc:0,pre:0}],t:[{t:0,w:0,p:''}]},results:[]};

    const a = {id:res[0].id,n:res[0].n,isCore:res[0].isCore,isLock:res[0].isLock,isGrade:res[0].isGrade,gd:res[0].gd.sort((a: { pre: number; },b: { pre: number; })=>b.pre-a.pre),t:res[0].t};

    
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