import {config} from '$lib/state.svelte';
export const getTotals=(results:{sc:string,gd:string}[],courses:string[]):{sc:string,gd:string,t:number}[]=>{

    let grades=config.grade.filter(el=>courses.includes(el.sc)).sort((a,b)=>a.sc.localeCompare(b.sc) ||b.pc-a.pc).map(el=>({sc:el.sc,gd:el.gd}));
	//console.log(grades);


    let ts:{sc:string,gd:string,t:number}[]=[];
    //const c = ['a','b','a','c','a'].reduce((acc,el)=>acc + (el==='a' ? 1 : 0),0);
    ts=grades.map(el=>({sc:el.sc,gd:el.gd,t:results.reduce((a,e)=>a+(e.gd===el.gd ? 1: 0),0)}));
    return ts;
};


export const getPercentages=(results:{sc:string,gd:string}[],courses:string[]):{sc:string,gd:string,t:number}[]=>{

    let grades=config.grade.filter(el=>courses.includes(el.sc)).sort((a,b)=>a.sc.localeCompare(b.sc) ||b.pc-a.pc).map(el=>({sc:el.sc,gd:el.gd}));
	//console.log(grades);


    let ts:{sc:string,gd:string,t:number}[]=[];
    //const c = ['a','b','a','c','a'].reduce((acc,el)=>acc + (el==='a' ? 1 : 0),0);
    ts=grades.map(el=>({sc:el.sc,gd:el.gd,t:results.length && results.length>0 ? Math.round(10000*results.reduce((a,e)=>a+(e.gd===el.gd ? 1: 0),0)/results.length)/100 : 0}));
    return ts;
};