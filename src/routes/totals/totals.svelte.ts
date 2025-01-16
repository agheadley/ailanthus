import type {ExamTable} from '$lib/_db';
import {config} from '$lib/state.svelte';
import * as util from '$lib/util';


const getTotals=(results:{sc:string,sl:string,ss:string,sr:string,gd:string}[],grades:{sc:string,gd:string}[]):{sc:string,gd:string,t:number}[]=>{
    let ts:{sc:string,gd:string,t:number}[]=[];
    const c = ['a','b','a','c','a'].reduce((acc,el)=>acc + (el==='a' ? 1 : 0),0);
    ts=grades.map(el=>({sc:el.sc,gd:el.gd,t:results.reduce((a,e)=>a+(e.gd===el.gd ? 1: 0),0)}));


    return ts;
};


const getSubjects=(data:ExamTable[]):{sc:string,sl:string,ss:string}[]=>{
    const scs=[ ... new Set(data.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    for(let sc of scs) {
        let subs =  util.unique(data.filter(el=>el.sc===sc).map(el=>({sl:el.sl,ss:el.ss,sc:el.sc})),['ss'])
            .sort((a,b)=>String(a.sl).localeCompare(String(b.sl)));
        
        console.log(subs);
    }

    return [];

};


export const getRaw=(data:ExamTable[]):any=>{

    let rows=getSubjects(data);



};

export const getPercentage=(data:ExamTable[]):any=>{

};

export const getKPI=(data:ExamTable[]):any=>{

};
