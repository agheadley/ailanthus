import type {ExamTable} from '$lib/_db';
import {config,cohorts} from '$lib/state.svelte';
import * as util from '$lib/util';




const getSubjects=(data:ExamTable[]):{sc:string,sl:string,ss:string}[]=>{
    const scs=[ ... new Set(data.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    let subjects:{sc:string,sl:string,ss:string}[]=[];
    for(const sc of scs) {
        const subs = <{sc:string,sl:string,ss:string}[]> util.unique(data.filter(el=>el.sc===sc).map(el=>({sl:String(el.sl),ss:String(el.ss),sc:String(el.sc)})),['ss'])
            .sort((a,b)=>String(a.sl).localeCompare(String(b.sl)))
        //console.log(subs);
        subjects=subjects.concat(subs);
    }

    
    return subjects;

};

interface Total {
    sc:string,
    totals:{sc:string,sl:string,ss:string,all:{sc:string,gd:string,t:number}[],m:{sc:string,gd:string,t:number}[],f:{sc:string,gd:string,t:number}[]}[]
};

export const getRaw=(data:ExamTable[]):Total[]=>{
    const raw = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        const row:Total={sc:course,totals:[]};
        let item = {sc:course,sl:'ALL',ss:'*',
            all:util.getTotals(data.filter(el=>el.sc===course).map(el=>({gd:el.gd,sc:el.sc})),[course]),
            m:util.getTotals(data.filter(el=>el.sc===course && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
            f:util.getTotals(data.filter(el=>el.sc===course && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
            
        };
        row.totals.push(item);
        for(const subject of subjects.filter(el=>el.sc===course)) {
            item = {sc:course,sl:subject.sl,ss:subject.sc,
                all:util.getTotals(data.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>({gd:el.gd,sc:el.sc})),[course]),
                m:util.getTotals(data.filter(el=>el.sc===course &&  el.ss===subject.ss && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
                f:util.getTotals(data.filter(el=>el.sc===course && el.ss===subject.ss && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
                
            };
            row.totals.push(item);
        }

        raw.push(row);
    } 

    return raw;
};

export const getPercentage=(data:ExamTable[]):Total[]=>{
    const percentage = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        const row:Total={sc:course,totals:[]};
        let item = {sc:course,sl:'ALL',ss:'*',
            all:util.getPercentages(data.filter(el=>el.sc===course).map(el=>({gd:el.gd,sc:el.sc})),[course]),
            m:util.getPercentages(data.filter(el=>el.sc===course && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
            f:util.getPercentages(data.filter(el=>el.sc===course && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
            
        };
        row.totals.push(item);
        for(const subject of subjects.filter(el=>el.sc===course)) {
            item = {sc:course,sl:subject.sl,ss:subject.sc,
                all:util.getPercentages(data.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>({gd:el.gd,sc:el.sc})),[course]),
                m:util.getPercentages(data.filter(el=>el.sc===course &&  el.ss===subject.ss && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
                f:util.getPercentages(data.filter(el=>el.sc===course && el.ss===subject.ss && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
                
            };
            row.totals.push(item);
        }

        percentage.push(row);
    } 

    return percentage;

};



interface KPI {
    section:string,
    results:{
        yr:number,
        a:{kpi:string,pc:number}[],
        m:{kpi:string,pc:number}[],
        f:{kpi:string,pc:number}[]
    }[]

};

export const getKPI=(data:{yr:number,results:ExamTable[]}[]):KPI[]=>{
    
    const out:KPI[]=[];

    const list = config.kpi.filter(el=>el.nc===cohorts.exam.list[cohorts.exam.index].nc);
    
    const sections = util.unique(<{order:number,section:string,nc:number,kpi:string,sc:string,gd:string}[]>list,['section']).sort((a,b)=>Number(a.order)-Number(b.order))
        .map(el=>el.section);
    
   

        for(const section of sections) {

            const kpis=util.unique(list.filter(el=>el.section===section),['kpi']).sort((a,b)=>Number(a.order)-Number(b.order))
                .map(el=>el.kpi);
    
            const results = list.filter(el=>el.section===section).map(el=>({sc:el.sc,gd:el.gd}));
            const courses = [... new Set(results.map(el=>el.sc))];

            const outItem:KPI={section:String(section),results:[]};

            for(const yr of data) {

                const allData = yr.results.filter(el=>courses.includes(el.sc));
                const fData = yr.results.filter(el=>courses.includes(el.sc) && el.gnd==='F');
                const mData = yr.results.filter(el=>courses.includes(el.sc) && el.gnd==='M');
                const total = allData.length ? allData.length : 0;
                const fTotal = fData.length ? fData.length : 0;
                const mTotal = mData.length ? mData.length : 0;

                //console.log(`yr: ${yr.yr} section: ${section} total: ${total} fTotal: ${fTotal} mTotal: ${mTotal}`);

                const aKPIs=[];
                const fKPIs=[];
                const mKPIs=[];

                for(const kpi of kpis) {
                

                    const kpiList=list.filter(el=>el.section===section && el.kpi===kpi).map(el=>`sc:${el.sc},gd:${el.gd}`);
                    
                    //console.log(yr.yr,section,kpi,courses,total,kpiList);
        
                    let a = allData.filter(el=>kpiList.includes(`sc:${el.sc},gd:${el.gd}`)).length;
                    let m = mData.filter(el=>kpiList.includes(`sc:${el.sc},gd:${el.gd}`)).length;
                    let f = fData.filter(el=>kpiList.includes(`sc:${el.sc},gd:${el.gd}`)).length;
                    
                    //console.log(yr.yr,section,kpi,courses,total,kpiList,a);
                    
                    a = total>0 ? Math.round(10000*a/total)/100 : 0;
                    m = mTotal>0 ? Math.round(10000*m/mTotal)/100 : 0;
                    f = fTotal>0 ? Math.round(10000*f/fTotal)/100 : 0;

                    // create arr of sc+/+gd and use includes to filte r/ count etc
                    //make into % with total etc
                    //console.log(yr.yr,section,kpi,courses,total,kpiList,a,m,f);
        
                    aKPIs.push({kpi:String(kpi),pc:a});
                    mKPIs.push({kpi:String(kpi),pc:m});
                    fKPIs.push({kpi:String(kpi),pc:f});
                  
                }

                outItem.results.push({yr:yr.yr,a:aKPIs,m:mKPIs,f:fKPIs});
        }

        out.push(outItem);
    }
   
    //console.log(out);
   

    return out;
};
