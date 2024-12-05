import {config} from '$lib/state.svelte';

interface TableRow {
    nc:number,
    sc:string,
    ss:string,
    sl:string,
    g:string,
    pupil:{pid:number,sn:string,pn:string,overall:{A:number,B:number}}[]

};

export const getTable=(nc:number,sc:string,ss:string) : TableRow[]=>{
    let table:TableRow[]=config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss)
        .map(el=>(
            {nc:nc,sc:sc,ss:ss,sl:el.sl,g:el.g,pupil:el.pupil.map(p=>(
                {pid:p.pid,sn:p.sn,pn:p.pn,
                    overall:{A:0,B:0}

                }))
        
        
    }));

    for(let g of table) {
        for(let p of g.pupil) {
            let f=config.pupils.find(el=>el.pid===p.pid);
            p.overall.A = f ? f.overall.A : 0;
            p.overall.B = f ? f.overall.B : 0;
            
        }
    }

    return table;
};