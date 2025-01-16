export const getTotals=(results:{sc:string,gd:string}[],grades:{sc:string,gd:string}[]):{sc:string,gd:string,t:number}[]=>{
    let ts:{sc:string,gd:string,t:number}[]=[];
    //const c = ['a','b','a','c','a'].reduce((acc,el)=>acc + (el==='a' ? 1 : 0),0);
    ts=grades.map(el=>({sc:el.sc,gd:el.gd,t:results.reduce((a,e)=>a+(e.gd===el.gd ? 1: 0),0)}));
    return ts;
};