import {config} from '$lib/state.svelte';

export const getIntakeBar=(scr:number,std:string):string=>{
    let txt=`<svg width="2.5rem" height="1.25rem" viewbox="0 0 50 25" xmlns="http://www.w3.org/2000/svg">`;
    txt+=`<g>`;
    txt+=` <rect x="0" y="12" width="50" height="8" fill='#ddd'></rect>`;
    txt+=`<text x="0" y="10" font-size="10" font-weight="600" fill='#333'>${std==='GCSE'?String(Math.round(10*scr)/10):String(Math.round(scr))}</text>`;
    if(std==='GCSE') {
        txt+=` <rect x="0" y="12" width=${50*scr/9} height="8" fill='#1E90FF88'></rect>`;
    } else {
        if(scr>=100) {
            txt+=` <rect x="0" y="12" width="${(50*(scr-60)/(140-60))>0 ? (50*(scr-60)/(140-60)) : 0}" height="8" fill='rgba(34,139,34,0.5)'></rect>`;
        } else {
            txt+=` <rect x="0" y="12" width="${(50*(scr-60)/(140-60))>0 ? (50*(scr-60)/(140-60)) : 0}" height="8" fill='rgba(178,34,34,0.5)'></rect>`;
        }
    }
    
    txt+=`</g>`;
    txt+=`</svg>`;
    
    return txt;
};

export const getGrade=(isRag:boolean,gd:string,residual:number):string=>{
   

    let txt=``;

    if(isRag) {
        if(residual<config.rag.red) {
            txt=` <div style="width:2rem;text-align: center;overflow:hidden;padding:0.1rem;background:rgba(${178},${34},${34},${0.1+0.8*Math.abs(residual)/10})">${gd}</div>`;
        } else if(residual>=config.rag.green) {
            txt=` <div style="width:2rem;text-align: center;overflow:hidden;padding:0.1rem;background:rgba(${34},${139},${34},${0.1+0.8*Math.abs(residual)/10})">${gd}</div>`;
        } else txt=`<div style="width:2rem;text-align: center;overflow:hidden;padding:0.1rem;">${gd}</div>`;
    } else txt=`<div style="width:2rem;text-align: center;overflow:hidden;padding:0.1rem;">${gd}</div>`;
    return txt;
};

export const getAssessmentTitle=(title:string,subTitle:string):string=>{


    return `<div style="position:relative;font-size:0.8rem;width:2rem;height:6rem">
        <div style="border:0px solid black;position:absolute;bottom:0;line-height:1rem;writing-mode:vertical-rl;overflow:hidden;transform:rotate(-180deg);">
             <div style=" font-weight:bold;">${title}</div>
             <div style="font-weight:normal;">${subTitle}</div>
        </div>
    </div>
    `;
    /*
    return `<div style=" font-size:0.8rem;position:relative;width:2rem;height:8rem;border:0px solid #333;overflow:hidden;">
        <div style=" position:absolute;top:6rem;width:10rem;height:4rem;border:0;overflow:hidden;transform: translate(-2rem,-3rem) rotate(-80deg);line-height:0.8rem;">
            <div style=" font-weight:bold;">${title}</div>
            <div style=" font-weight:bold;">${subTitle}</div>
        </div>
    </div>`;
    */
};

