import type {ExamTable} from '$lib/_db';
import {config} from '$lib/state.svelte';
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


export const getRaw=(data:ExamTable[]):any=>{

    const rows=getSubjects(data);
    console.log(rows)

    return ;
};

export const getPercentage=(data:ExamTable[]):any=>{

};

export const getKPI=(data:ExamTable[]):any=>{

};
