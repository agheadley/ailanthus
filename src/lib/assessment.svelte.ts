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