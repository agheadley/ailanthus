
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
