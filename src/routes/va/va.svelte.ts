import type { ExamTable } from "$lib/_db";
import * as util from '$lib/util';

const getVA=(results:(number|null )[]):{n:number,v:number,s:0|2|3}=>{
    let out:{n:number,v:number,s:0|2|3}={n:0,v:0,s:0};

    results=results.filter(el=>el!==null);

    if(results.length && results.length>0) {
        out.v=results.filter(el=>el!==null).reduce((a,b) => a + b, 0) / results.length;
        out.v=Math.round(100*out.v)/100;
        out.n=results.length;
        let lp=1/Math.sqrt(out.n);
        out.s = Math.abs(out.v) <= 2*lp ? 0 : Math.abs(out.v) > 3*lp ? 3 : 2;  
    }
    return out;
};


const getSubjects=(data:ExamTable[]):{sc:string,sl:string,ss:string}[]=>{
    const scs=[ ... new Set(data.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    let subjects:{sc:string,sl:string,ss:string}[]=[];
    for(const sc of scs) {
        const subs = <{sc:string,sl:string,ss:string}[]> util.unique(data.filter(el=>el.sc===sc).map(el=>({sl:String(el.sl),ss:String(el.ss),sc:String(el.sc)})),['ss'])
            .sort((a,b)=>String(a.sl).localeCompare(String(b.sl)))
       
        subjects=subjects.concat(subs);
    }

    
    return subjects;

};


interface OverallVA  {
    sc:string,
    sl:string,
    ss:string,
    all:{yr:number,A:{n:number,v:number,s:0|2|3},B:{n:number,v:number,s:0|2|3}}[],
    m:{yr:number,A:{n:number,v:number,s:0|2|3},B:{n:number,v:number,s:0|2|3}}[],
    f:{yr:number,A:{n:number,v:number,s:0|2|3},B:{n:number,v:number,s:0|2|3}}[],
    
};


export const getOverall=(data:{yr:number,results:ExamTable[]}[]):OverallVA[]=>{

    const subjects=getSubjects(data[0].results);
    const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    data=data.sort((a,b)=>a.yr-b.yr);

    let rows:OverallVA[]=[];

    let line:OverallVA = {sc:'ALL',sl:'ALL',ss:'*',all:[],m:[],f:[]};

    line.all=data.map(el=>({yr:el.yr,A:getVA(el.results.map(el=>el.stdResA)),B:getVA(el.results.map(el=>el.stdResB))}));
    line.m=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='M').map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='M').map(el=>el.stdResB))}));
    line.f=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='F').map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='F').map(el=>el.stdResB))}));
    
    //console.log(line);
    rows.push(line);

    for(const course of courses) {
        line = {sc:course,sl:'ALL',ss:'*',all:[],m:[],f:[]};
        line.all=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.sc===course).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.sc===course).map(el=>el.stdResB))}));
        line.m=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='M' && el.sc===course).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='M' && el.sc===course).map(el=>el.stdResB))}));
        line.f=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='F' && el.sc===course).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='F' && el.sc===course).map(el=>el.stdResB))}));
        rows.push(line);
        for(const subject of subjects) {
            //console.log(`${course} ${subject.sl} ${subject.ss}`);
            line = {sc:course,sl:subject.sl,ss:subject.ss,all:[],m:[],f:[]};
            line.all=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.sc===course && el.ss===subject.ss).map(el=>el.stdResB))}));
            line.m=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='M' && el.sc===course && el.ss===subject.ss).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='M' && el.sc===course && el.ss===subject.ss).map(el=>el.stdResB))}));
            line.f=data.map(el=>({yr:el.yr,A:getVA(el.results.filter(el=>el.gnd==='F' && el.sc===course && el.ss===subject.ss).map(el=>el.stdResA)),B:getVA(el.results.filter(el=>el.gnd==='F' && el.sc===course && el.ss===subject.ss).map(el=>el.stdResB))}));
            rows.push(line);
        }
    }


   
    return rows;
  


};

interface GroupVA {
    sc:string,
    sl:string,
    ss:string,
    g:{g:string,A:{n:number,v:number,s:0|2|3},B:{n:number,v:number,s:0|2|3},cfA:{n:number,v:number,s:0|2|3},cfB:{n:number,v:number,s:0|2|3}}[]
}

export const getGroups=(data:ExamTable[]):GroupVA[]=>{
    const subjects=getSubjects(data);
    //const courses=[ ... new Set(subjects.map(el=>el.sc))].sort((a,b)=>a.localeCompare(b));

    let rows:GroupVA[]=[];

    //console.log(data);

    for(let subject of subjects) {
        
        let line : GroupVA = {sc:subject.sc,sl:subject.sl,ss:subject.ss,g:[]};

        let members = data.filter(el=>el.sc===subject.sc && el.ss===subject.ss ).map(el=>el.pid);
         

        line.g.push({
            g:'ALL',
            A:getVA(data.filter(el=>el.sc===subject.sc && el.ss===subject.ss).map(el=>el.stdResA)),
            B:getVA(data.filter(el=>el.sc===subject.sc && el.ss===subject.ss).map(el=>el.stdResB)),
            cfA:getVA(data.filter(el=>(el.sc!==subject.sc || el.ss!==subject.ss) && members.includes(el.pid)).map(el=>el.stdResA)),
            cfB:getVA(data.filter(el=>(el.sc!==subject.sc || el.ss!==subject.ss) && members.includes(el.pid)).map(el=>el.stdResB))
            
        });

        const groups=[ ... new Set(data.filter(el=>el.sc===subject.sc && el.ss===subject.ss).map(el=>el.g))].sort((a,b)=>a.localeCompare(b));
        for(const group of groups) {
            //console.log(subject.sc, subject.sl,group);

            let members = data.filter(el=>el.sc===subject.sc && el.ss===subject.ss && el.g===group).map(el=>el.pid);
            //console.log(members);
            line.g.push({
                g:group,
                A:getVA(data.filter(el=>el.sc===subject.sc && el.ss===subject.ss && el.g===group).map(el=>el.stdResA)),
                B:getVA(data.filter(el=>el.sc===subject.sc && el.ss===subject.ss && el.g===group).map(el=>el.stdResB)),
                cfA:getVA(data.filter(el=>(el.sc!==subject.sc || el.ss!==subject.ss) && members.includes(el.pid)).map(el=>el.stdResA)),
                cfB:getVA(data.filter(el=>(el.sc!==subject.sc || el.ss!==subject.ss) && members.includes(el.pid)).map(el=>el.stdResB))  
            });



        }

        rows.push(line);
    }

    console.log(rows);

    return rows;

};

export const getIntake=(data:ExamTable[])=>{

};

