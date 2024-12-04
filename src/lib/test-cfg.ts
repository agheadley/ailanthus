export const subjects = [
    {
      "lv": "L",
      "sc": "L",
      "ss": "E"
    },
    {
      "lv": "L",
      "sc": "L",
      "ss": "G"
    },
    {
      "lv": "L",
      "sc": "L",
      "ss": "H"
    },
    {
      "lv": "L",
      "sc": "L",
      "ss": "M"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "M"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "C"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "E"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "G"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "H"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "B"
    },
    {
      "lv": "M",
      "sc": "G",
      "ss": "P"
    },
    {
      "lv": "U",
      "sc": "B",
      "ss": "BM"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "C"
    },
    {
      "lv": "U",
      "sc": "I",
      "ss": "Ch"
    },
    {
      "lv": "U",
      "sc": "I",
      "ss": "Gs"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "M"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "P"
    },
    {
      "lv": "U",
      "sc": "I",
      "ss": "Spis"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "B"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "Eli"
    },
    {
      "lv": "U",
      "sc": "B",
      "ss": "SpS"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "F"
    },
    {
      "lv": "U",
      "sc": "A",
      "ss": "L"
    }
   ];

   export const base = [
        {A:123,B:115},
        {A:101,B:97},
        {A:82,B:81}
   ];

   export const baseName : string[] = ['overall','vocab','maths','skills'];


   export const pre : {L:{A:number,B:number},G:{A:number,B:number},A:{A:number,B:number},I:{A:number,B:number},B:{A:number,B:number}}[] = [
        {L:{A:8.2,B:8.0},G:{A:8.3,B:8.1},A:{A:122,B:118},I:{A:6.2,B:6.1},B:{A:120,B:117}},
        {L:{A:6.8,B:6.7},G:{A:7.1,B:6.7},A:{A:97,B:93},I:{A:5.7,B:5.7},B:{A:93,B:95}},
        {L:{A:5.1,B:4.9},G:{A:5.1,B:4.9},A:{A:81,B:83},I:{A:4.8,B:4.9},B:{A:81,B:81}}
        
        
   ];

   export const random=(min:number, max:number) : number=> {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  export const getBase=(index:number)=>{

	const b:{type:string,A:number,B:number}[]=[];
	for(const row of baseName) {
		b.push({type:row,A:base[index].A+random(-5,5),B:base[index].B+random(-5,5)});
	}
	return b;
};

export const getGroups=(index:number,gps:{ss:string,sc:'L'|'G'|'A'|'I'|'B',g:string,lv:string,yr:number,nc:number}[])
     : {nc:number,lv:string,yr:number,ss:string,sc:string,g:string,pre:{A:number,B:number}}[]=>{
    let out = [];
    for(const item of gps) {
        const ii=random(-3,3);
        let x=0;
        let y=0;
        if(pre[index][item.sc]) {
            x=pre[index][item.sc].A+ii*pre[index][item.sc].A/20;
            y=pre[index][item.sc].B+ii*pre[index][item.sc].B/20;
        }
        
        

        out.push({nc:item.nc,lv:item.lv,yr:Number(item.yr),sc:item.sc,ss:item.ss,g:item.g,pre:{A:x,B:y}})
    }

    out=out.sort((a,b)=>a.yr-b.yr || a.ss.localeCompare(b.ss));

    return out;

};