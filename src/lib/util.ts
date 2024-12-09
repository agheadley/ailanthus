
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

