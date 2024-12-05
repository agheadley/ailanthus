export let getIntakeBar=(scr:number,std:string):string=>{
    let txt=`<svg width="2.5rem" height="1.25rem"xmlns="http://www.w3.org/2000/svg">`;
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
    
    txt+`</g>`;
    txt+`</svg>`;
    
    return txt;
};