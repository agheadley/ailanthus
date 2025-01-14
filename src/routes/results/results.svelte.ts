
//import {config,cohorts,user} from '$lib/state.svelte';
import * as util from '$lib/util';
import type {ExamTable} from '$lib/_db.d';

interface ResultRow{
        pid:number,
        sn:string,
        pn:string,
        yr:number,
        nc:number,
        cols:{sc:string,sl:string,ss:string,sr:string,gd:string}[]
}

interface ResultCol {
    sc:string,
    sl:string,
    ss:string,
    sr:string,
    gd?:string

}

export const getResultsTable=(data:ExamTable[]):ResultRow[]=>{
    
    let rows:ResultRow[]=[];

    console.log(data);

    //rows = <ResultRow[]> util.unique(data,['pid']).map(el=>({pid:el.pid,sn:el.sn,pn:el.pn,yr:el.yr,nc:el.nc,cols:[]}));

    
    for(const item of data) {
        if(!rows.find(el=>el.pid===item.pid)) 
            rows.push({pid:item.pid,sn:item.sn,pn:item.pn,yr:item.yr,nc:item.nc,cols:[]});
    }
    

    rows=rows.sort((a,b)=>a.sn.localeCompare(b.sn) || a.pn.localeCompare(b.pn));

    let cols:ResultCol[]=[];
    //
    // util.unique(data.map(el=>({sc:el.sc,sl:el.sl,ss:el.ss,sr:el.sr})),['sc','ss','sr']);
    for(const item of data) {
        if(!cols.find(el=>el.sc===item.sc && el.ss===item.ss && el.sr===item.sr))    
            cols.push({sc:item.sc,sl:item.sl,ss:item.ss,sr:item.sr});
    }
    
    cols=cols.sort((a,b)=>a.sc.localeCompare(b.sc) || a.ss.localeCompare(b.ss) || a.sr.localeCompare(b.sr));



    console.log(cols);


    for(const item of rows) {
        for(const col of cols) {
            const res=data.filter(el=>el.pid===item.pid && el.sc===col.sc && el.ss===col.ss && el.sr===col.sr);
            if(res[0]) item.cols.push({sc:col.sc,sl:col.sl,ss:col.ss,sr:col.sr,gd:res[0].gd});
            else item.cols.push({sc:col.sc,sl:col.sl,ss:col.ss,sr:col.sr,gd:''});
        }
    }

   
    console.log(rows);

    return rows;
};
