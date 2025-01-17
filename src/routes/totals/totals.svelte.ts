import type {ExamTable} from '$lib/_db';
import {config,cohorts} from '$lib/state.svelte';
import * as util from '$lib/util';
import * as exam from '$lib/exam';




const getSubjects=(data:ExamTable[]):{sc:string,sl:string,ss:string}[]=>{
    const scs=[ ... new Set(data.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    let subjects:{sc:string,sl:string,ss:string}[]=[];
    for(const sc of scs) {
        const subs = <{sc:string,sl:string,ss:string}[]> util.unique(data.filter(el=>el.sc===sc).map(el=>({sl:String(el.sl),ss:String(el.ss),sc:String(el.sc)})),['ss'])
            .sort((a,b)=>String(a.sl).localeCompare(String(b.sl)))
        console.log(subs);
        subjects=subjects.concat(subs);
    }

    
    return subjects;

};

interface Total {
    sc:string,
    totals:{sc:string,sl:string,ss:string,all:{sc:string,gd:string,t:number}[],m:{sc:string,gd:string,t:number}[],f:{sc:string,gd:string,t:number}[]}[]
};

export const getRaw=(data:ExamTable[]):Total[]=>{

    let raw = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        let row:Total={sc:course,totals:[]};
        let item = {sc:course,sl:'ALL',ss:'*',
            all:exam.getTotals(data.filter(el=>el.sc===course).map(el=>({gd:el.gd,sc:el.sc})),[course]),
            m:exam.getTotals(data.filter(el=>el.sc===course && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
            f:exam.getTotals(data.filter(el=>el.sc===course && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
            
        };
        row.totals.push(item);
        for(const subject of subjects.filter(el=>el.sc===course)) {
            item = {sc:course,sl:subject.sl,ss:subject.sc,
                all:exam.getTotals(data.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>({gd:el.gd,sc:el.sc})),[course]),
                m:exam.getTotals(data.filter(el=>el.sc===course &&  el.ss===subject.ss && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
                f:exam.getTotals(data.filter(el=>el.sc===course && el.ss===subject.ss && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
                
            };
            row.totals.push(item);
        }

        raw.push(row);
    } 

    return raw;
};

export const getPercentage=(data:ExamTable[]):Total[]=>{

    let percentage = [];
    const subjects=getSubjects(data);
    
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));
    
    for(const course of courses) {
        let row:Total={sc:course,totals:[]};
        let item = {sc:course,sl:'ALL',ss:'*',
            all:exam.getPercentages(data.filter(el=>el.sc===course).map(el=>({gd:el.gd,sc:el.sc})),[course]),
            m:exam.getPercentages(data.filter(el=>el.sc===course && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
            f:exam.getPercentages(data.filter(el=>el.sc===course && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
            
        };
        row.totals.push(item);
        for(const subject of subjects.filter(el=>el.sc===course)) {
            item = {sc:course,sl:subject.sl,ss:subject.sc,
                all:exam.getPercentages(data.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>({gd:el.gd,sc:el.sc})),[course]),
                m:exam.getPercentages(data.filter(el=>el.sc===course &&  el.ss===subject.ss && el.gnd==='M').map(el=>({gd:el.gd,sc:el.sc})),[course]),
                f:exam.getPercentages(data.filter(el=>el.sc===course && el.ss===subject.ss && el.gnd==='F').map(el=>({gd:el.gd,sc:el.sc})),[course])
                
            };
            row.totals.push(item);
        }

        percentage.push(row);
    } 

    return percentage;

};

export const getKPI=(data:ExamTable[]):any=>{
    console.log(cohorts.exam.list[cohorts.exam.index].nc);

    return;
};
