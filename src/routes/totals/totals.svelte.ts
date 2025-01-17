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
    data=data.filter(el=>el.gd!=='X');

    let raw = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        let row:Total={sc:course,totals:[]};
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
    data=data.filter(el=>el.gd!=='X');
    let percentage = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        let row:Total={sc:course,totals:[]};
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





export const getKPI=(data:ExamTable[]):any=>{
    data=data.filter(el=>el.gd!=='X');



    let list = config.kpi.filter(el=>el.nc===cohorts.exam.list[cohorts.exam.index].nc);
    
    let sections = util.unique(<{order:number,section:string,nc:number,kpi:string,sc:string,gd:string}[]>list,['section']).sort((a,b)=>Number(a.order)-Number(b.order))
        .map(el=>el.section);
    

    for(const section of sections) {

        const kpis=util.unique(list.filter(el=>el.section===section),['kpi']).sort((a,b)=>Number(a.order)-Number(b.order))
            .map(el=>el.kpi);

        for(let kpi of kpis) {
            let results = list.filter(el=>el.section===section).map(el=>({sc:el.sc,gd:el.gd}));
            let courses = [... new Set(results.map(el=>el.sc))];

            

            const allData = data.filter(el=>courses.includes(el.sc));
            const total = allData.length ? allData.length : 0;

            console.log(section,kpi,courses,total);

            //for(const result of results) console.log(result);



        }


    }
    
    return;
};
