

/* 
N.B. need to use objects, not simple number, boolean, string for $state to by used in different files
https://www.reddit.com/r/sveltejs/comments/1fud3wg/state_reactivity_returned_by_class_method_not/?scrlybrkr=dc0fd66d
https://svelte.dev/playground/untitled?version=5.5.3#H4sIAAAAAAAACoVUwW6bQBD9ldGqkkFCuGfASFFPPURVpUo9hBwIO9ib4lm6OySNEP9eLQs2JFg52BIzb97svvegF7Vq0IrkoRdUnlEk4q5tRST4rXUP9gUbRhEJqztTuUpmK6NazgsqWJ1bbRh6OKO15RF_dtghDFAbfYZdvGe0HHuK-Nnu3Ij71R1VrDTBqSTZYBD2Y4eXLHEpZRC6-lBQtr8upeypY9YEmqpGVX8OvWcZciilnE8C2d7D8oKyNmfNZQOK5raFBunIpwT61dIj8v2E-E5jKQhjDx2yffuO7K8DbFD8LhUrOv6YGW6NQqU7YjSfUnzzuIlJROKspaoVSpGw6XCILuYtFL-a-GyXBlZNaS3cLx0b9Z-l8aUDfLFcMgYPj2Hq2q-rE7m-RKNeUMZPb0EQwiEHPikbr2gm7bYYpjtdF311blPBGwLCFBCD3Bnye9Zs6ZSUjfGLeJ-zTNALmaf7kIgtotW1F_NjjKH3wS-40mR5TuEvfSclHGa6gllxgwkUo43MUIhobkn0r4DS5ACLR6i1ATcAhfDoIZ2mxv8NV9rOnoLlIcJ0gb3l00170-vddINxo4_BrqxBkUXDu2hL6c3itCqc9R8lxH_jN2Yl3BxBwtdVkIMw_fhyPA7_Aa1CZTLlBAAA
*/

export const alert = $state({msg:"",type:'',ms:3000});
export const user = $state({name:'DB',isAdmin:true,isTeacher:true,isPupil:false,sal:'',pn:'',sn:''});


export const config = $state({
    isReady:false,
    year:{
      "yr": [
        {
          "nc": 13,
          "add": 0
        },
        {
          "nc": 12,
          "add": 1
        },
        {
          "nc": 11,
          "add": 0
        },
        {
          "nc": 10,
          "add": 1
        },
        {
          "nc": 9,
          "add": 2
        },
        {
          "nc": 8,
          "add": 3
        },
        {
          "nc": 7,
          "add": 4
        }
      ],
      "rollover": {
        "month": 8
      }
    },
    rag:{red:0,green:0},
    groups:[{id:0,sc:'',ss:'',sl:'',g:'',nc:0,log:'',pupil:[{pid:0,nc:0,sn:'',pn:'',gnd:'',hse:''}],teacher:[{tid:'',sal:''}]}],
    teachers:[{id:0,mid:'',tid:'',sal:'',pn:'',sn:''}],
    pupils:[{id:0,mid:'',pid:0,nc:0,sn:'',pn:'',gnd:'',hse:'',tg:'',overall:{A:0,B:0},base:[{type:'',A:0,B:0}],groups:[{nc:0,sc:'',ss:'',sl:'',g:'',pre:{A:0,B:0}}]}],
    std:[{nc:6,A:'NAT',B:'IND'},{nc:7,A:'NAT',B:'IND'},{nc:8,A:'NAT',B:'IND'},{nc:9,A:'NAT',B:'IND'},{nc:10,A:'NAT',B:'IND'},{nc:11,A:'NAT',B:'IND'},{nc:12,A:'GCSE',B:'ALIS'},{nc:13,A:'GCSE',B:'ALIS'}],
    grade:[
        {
          "sc": "A",
          "gd": "A*",
          "pc": 90,
          "pre": 140
        },
        {
          "sc": "A",
          "gd": "A",
          "pc": 80,
          "pre": 120
        },
        {
          "sc": "A",
          "gd": "B",
          "pc": 70,
          "pre": 100
        },
        {
          "sc": "A",
          "gd": "C",
          "pc": 60,
          "pre": 80
        },
        {
          "sc": "A",
          "gd": "D",
          "pc": 50,
          "pre": 60
        },
        {
          "sc": "A",
          "gd": "E",
          "pc": 40,
          "pre": 40
        },
        {
          "sc": "A",
          "gd": "U",
          "pc": 0,
          "pre": 0
        },
        {
          "sc": "B",
          "gd": "D*",
          "pc": 101,
          "pre": 140
        },
        {
          "sc": "B",
          "gd": "D",
          "pc": 80,
          "pre": 120
        },
        {
          "sc": "B",
          "gd": "M",
          "pc": 60,
          "pre": 80
        },
        {
          "sc": "B",
          "gd": "P",
          "pc": 30,
          "pre": 40
        },
        {
          "sc": "B",
          "gd": "NP",
          "pc": 20,
          "pre": 20
        },
        {
          "sc": "B",
          "gd": "U",
          "pc": 0,
          "pre": 0
        },
        {
          "sc": "G",
          "gd": "9",
          "pc": 90,
          "pre": 9
        },
        {
          "sc": "G",
          "gd": "8",
          "pc": 80,
          "pre": 8
        },
        {
          "sc": "G",
          "gd": "7",
          "pc": 70,
          "pre": 7
        },
        {
          "sc": "G",
          "gd": "6",
          "pc": 60,
          "pre": 6
        },
        {
          "sc": "G",
          "gd": "5",
          "pc": 50,
          "pre": 5
        },
        {
          "sc": "G",
          "gd": "4",
          "pc": 40,
          "pre": 4
        },
        {
          "sc": "G",
          "gd": "3",
          "pc": 30,
          "pre": 3
        },
        {
          "sc": "G",
          "gd": "2",
          "pc": 20,
          "pre": 2
        },
        {
          "sc": "G",
          "gd": "1",
          "pc": 10,
          "pre": 1
        },
        {
          "sc": "G",
          "gd": "U",
          "pc": 0,
          "pre": 0
        },
        {
          "sc": "I",
          "gd": "7",
          "pc": 75,
          "pre": 7
        },
        {
          "sc": "I",
          "gd": "6",
          "pc": 65,
          "pre": 6
        },
        {
          "sc": "I",
          "gd": "5",
          "pc": 55,
          "pre": 5
        },
        {
          "sc": "I",
          "gd": "4",
          "pc": 45,
          "pre": 4
        },
        {
          "sc": "I",
          "gd": "3",
          "pc": 35,
          "pre": 3
        },
        {
          "sc": "I",
          "gd": "2",
          "pc": 25,
          "pre": 2
        },
        {
          "sc": "I",
          "gd": "1",
          "pc": 15,
          "pre": 1
        },
        {
          "sc": "I",
          "gd": "U",
          "pc": 0,
          "pre": 0
        },
        {
          "sc": "L",
          "gd": "M",
          "pc": 80,
          "pre": 8.5
        },
        {
          "sc": "L",
          "gd": "S",
          "pc": 65,
          "pre": 6.5
        },
        {
          "sc": "L",
          "gd": "D",
          "pc": 50,
          "pre": 4.5
        },
        {
          "sc": "L",
          "gd": "E",
          "pc": 30,
          "pre": 2
        },
        {
          "sc": "L",
          "gd": "U",
          "pc": 0,
          "pre": 0
        }
       ]
});


interface Cohort {
    nc:{list:{nc:number}[],index:number},
    subject:{list:{nc:number,sc:string,ss:string,sl:string}[],index:number},
    mySets:{list:{nc:number,g:string,sc:string,ss:string,sl:string}[],index:number},
    edit:{id:number,nc:number,sc:string,ss:string,sl:string,g:string,n:string,dt:number,ds:string,isEdit:boolean},
    exam:{list:{yr:number,nc:number}[],index:number}
}
    
export const cohorts:Cohort = $state({
  
    nc:{list:[{nc:0}],index:0},
    subject:{list:[{nc:0,sc:'',ss:'',sl:''}],index:0},
    mySets:{list:[{nc:0,g:'',sc:'',ss:'',sl:''}],index:0},
    edit:{id:0,nc:0,sc:'',ss:'',sl:'',g:'',n:'',dt:0,ds:'',isEdit:false},
    exam:{list:[{yr:0,nc:0}],index:0}
    
});









