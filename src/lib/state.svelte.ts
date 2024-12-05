

/* 
N.B. need to use objects, not simple number, boolean, string for $state to by used in different files
https://www.reddit.com/r/sveltejs/comments/1fud3wg/state_reactivity_returned_by_class_method_not/?scrlybrkr=dc0fd66d
https://svelte.dev/playground/untitled?version=5.5.3#H4sIAAAAAAAACoVUwW6bQBD9ldGqkkFCuGfASFFPPURVpUo9hBwIO9ib4lm6OySNEP9eLQs2JFg52BIzb97svvegF7Vq0IrkoRdUnlEk4q5tRST4rXUP9gUbRhEJqztTuUpmK6NazgsqWJ1bbRh6OKO15RF_dtghDFAbfYZdvGe0HHuK-Nnu3Ij71R1VrDTBqSTZYBD2Y4eXLHEpZRC6-lBQtr8upeypY9YEmqpGVX8OvWcZciilnE8C2d7D8oKyNmfNZQOK5raFBunIpwT61dIj8v2E-E5jKQhjDx2yffuO7K8DbFD8LhUrOv6YGW6NQqU7YjSfUnzzuIlJROKspaoVSpGw6XCILuYtFL-a-GyXBlZNaS3cLx0b9Z-l8aUDfLFcMgYPj2Hq2q-rE7m-RKNeUMZPb0EQwiEHPikbr2gm7bYYpjtdF311blPBGwLCFBCD3Bnye9Zs6ZSUjfGLeJ-zTNALmaf7kIgtotW1F_NjjKH3wS-40mR5TuEvfSclHGa6gllxgwkUo43MUIhobkn0r4DS5ACLR6i1ATcAhfDoIZ2mxv8NV9rOnoLlIcJ0gb3l00170-vddINxo4_BrqxBkUXDu2hL6c3itCqc9R8lxH_jN2Yl3BxBwtdVkIMw_fhyPA7_Aa1CZTLlBAAA
*/

export const alert = $state({msg:"",type:'',ms:3000});
export const user = $state({name:'DB',isAdmin:true,isTeacher:true,isPupil:false,sal:'',pn:'',sn:''});


export const config = $state({
    isReady:false,
    groups:[{id:0,sc:'',ss:'',sl:'',g:'',nc:0,log:'',pupil:[{pid:0,nc:0,sn:'',pn:'',gnd:'',hse:''}],teacher:[{tid:'',sal:''}]}],
    teachers:[{id:0,mid:'',tid:'',sal:'',pn:'',sn:''}],
    pupils:[{id:0,mid:'',pid:0,nc:0,sn:'',pn:'',gnd:'',hse:'',tg:'',overall:{A:0,B:0},base:[{type:'',A:0,B:0}],groups:[{nc:0,sc:'',ss:'',sl:'',g:'',pre:{A:0,B:0}}]}],
    std:[{nc:6,A:'NAT',B:'IND'},{nc:7,A:'NAT',B:'IND'},{nc:8,A:'NAT',B:'IND'},{nc:9,A:'NAT',B:'IND'},{nc:10,A:'NAT',B:'IND'},{nc:11,A:'NAT',B:'IND'},{nc:12,A:'GCSE',B:'ALIS'},{nc:13,A:'GCSE',B:'ALIS'}]
});


interface Cohort {
    nc:{list:{nc:number}[],index:number},
    subject:{list:{nc:number,sc:string,ss:string,sl:string}[],index:number},
    mySets:{list:{nc:number,g:string,sc:string,ss:string,sl:string}[],index:number}
}
    
export const cohorts:Cohort = $state({
  
    nc:{list:[{nc:0}],index:0},
    subject:{list:[{nc:0,sc:'',ss:'',sl:''}],index:0},
    mySets:{list:[{nc:0,g:'',sc:'',ss:'',sl:''}],index:0}
   
    

});









