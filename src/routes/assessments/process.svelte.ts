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
    const table:TableRow[]=config.groups.filter(el=>el.nc===nc && el.sc===sc && el.ss===ss)
        .map(el=>(
            {nc:nc,sc:sc,ss:ss,sl:el.sl,g:el.g,pupil:el.pupil.map(p=>(
                {pid:p.pid,sn:p.sn,pn:p.pn,
                    overall:{A:0,B:0}

                }))
        
        
    }));

    for(const g of table) {
        for(const p of g.pupil) {
            const f=config.pupils.find(el=>el.pid===p.pid);
            p.overall.A = f ? f.overall.A : 0;
            p.overall.B = f ? f.overall.B : 0;
            
        }
    }

    return table;
};

export const getStd=(nc:number):{A:string,B:string}=>{
    const f=config.std.find(el=>el.nc===nc);
    return f ? {A:f.A,B:f.B} : {A:'',B:''};
}