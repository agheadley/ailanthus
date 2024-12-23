import {config} from '$lib/state.svelte';


export const wait = (delay:number) => new Promise((resolve) => setTimeout(resolve, delay));
  

export const getDateTime=() : string =>{
  const x = new Date();
  const y = x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
  return y+" "+x.toTimeString().substring(0,5);
        
};

export const getDate=():string =>{
  const x = new Date();
  const y = x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
  return `${y}`;        
};

/* https://stackoverflow.com/questions/38613654/javascript-find-unique-objects-in-array-based-on-multiple-properties */
/* TYPES - https://www.geeksforgeeks.org/how-to-get-an-object-value-by-key-in-typescript/ */
export const unique = (arr:{ [key: string]: string|number|boolean }[],props:string[]) => [...new Map(arr.map(entry => [props.map(k=> String(entry[k])).join('|'), entry])).values()];

export const random=(min:number, max:number) : number=> {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export const getShortDate=(d:string):string=>{
  return d?.length===10 ? d[5]+d[6]+"/" +d[2]+d[3]: '00/00';
        
}


export const getStd=(nc:number):{A:string,B:string}=>{
    const f=config.std.find(el=>el.nc===nc);
    return f ? {A:f.A,B:f.B} : {A:'',B:''};
}

export const findGradeResidual=(sc:string,baseGrade:string,grade:string):number=>{
    const grades=config.grade.filter(el=>el.sc===sc).sort((a,b)=>b.pc-a.pc);
    const s1=grades.findIndex((/** @type {{ gd: string; }} */ el)=>el.gd===baseGrade);
    const s2=grades.findIndex((/** @type {{ gd: string; }} */ el)=>el.gd===grade);  
    return (s1===-1 || s2===-1) ? 0 : (s1-s2);
    
}

export const findAverageGrade=(sc:string,gradeArr:string[]):string=>{
    const grades=config.grade.filter(el=>el.sc===sc).sort((a,b)=>b.pc-a.pc);
    const indexArr:number[]=[];
    for(const gd of gradeArr) {
        const s=grades.findIndex((/** @type {{ gd: string; }} */ el)=>el.gd===gd);
        if(s>-1) indexArr.push(s);
    }
    //console.log(indexArr);
    let gd='X';
    if(indexArr.length) {
        const mean = Math.round(indexArr.reduce((a,b) => a+b) / indexArr.length);
        if(grades?.[mean]) gd=grades[mean].gd;
    }
    return gd;



    
};



