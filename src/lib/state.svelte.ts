

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
       ],
       kpi:[
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*",
          "sc": "A",
          "gd": "A*",
          "order": 1
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A*",
          "order": 2
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A",
          "order": 3
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A*",
          "order": 4
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A",
          "order": 5
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "B",
          "order": 6
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "A*",
          "order": 7
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "A",
          "order": 8
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "B",
          "order": 9
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "C",
          "order": 10
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "D",
          "order": 11
        },
        {
          "nc": 13,
          "section": "GCE",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "E",
          "order": 12
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*",
          "sc": "A",
          "gd": "A*",
          "order": 13
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*",
          "sc": "B",
          "gd": "D*",
          "order": 14
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*",
          "sc": "P",
          "gd": "D1",
          "order": 15
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*",
          "sc": "P",
          "gd": "D2",
          "order": 16
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A*",
          "order": 17
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A",
          "order": 18
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "B",
          "gd": "D*",
          "order": 19
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "B",
          "gd": "D",
          "order": 20
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D1",
          "order": 21
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D2",
          "order": 22
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D3",
          "order": 23
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "M1",
          "order": 24
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A*",
          "order": 25
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A",
          "order": 26
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "B",
          "order": 27
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "B",
          "gd": "D*",
          "order": 28
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "B",
          "gd": "D",
          "order": 29
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D1",
          "order": 30
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D2",
          "order": 31
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D3",
          "order": 32
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "M1",
          "order": 33
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "M2",
          "order": 34
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "A*",
          "order": 35
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "A",
          "order": 36
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "B",
          "order": 37
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "C",
          "order": 38
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "D",
          "order": 39
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "A",
          "gd": "E",
          "order": 40
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "B",
          "gd": "D*",
          "order": 41
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "B",
          "gd": "D",
          "order": 42
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "B",
          "gd": "M",
          "order": 43
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "B",
          "gd": "P",
          "order": 44
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "D1",
          "order": 45
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "D2",
          "order": 46
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "D3",
          "order": 47
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "M1",
          "order": 48
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "M2",
          "order": 49
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "M3",
          "order": 50
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "P1",
          "order": 51
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "P2",
          "order": 52
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC",
          "kpi": "(%) A*-E",
          "sc": "P",
          "gd": "P3",
          "order": 53
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*",
          "sc": "A",
          "gd": "A*",
          "order": 54
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*",
          "sc": "B",
          "gd": "D*",
          "order": 55
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*",
          "sc": "P",
          "gd": "D1",
          "order": 56
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*",
          "sc": "P",
          "gd": "D2",
          "order": 57
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*",
          "sc": "I",
          "gd": "7",
          "order": 58
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A*",
          "order": 59
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "A",
          "gd": "A",
          "order": 60
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "B",
          "gd": "D*",
          "order": 61
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "B",
          "gd": "D",
          "order": 62
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D1",
          "order": 63
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D2",
          "order": 64
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "D3",
          "order": 65
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "P",
          "gd": "M1",
          "order": 66
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "I",
          "gd": "7",
          "order": 67
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-A",
          "sc": "I",
          "gd": "6",
          "order": 68
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A*",
          "order": 69
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "A",
          "order": 70
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "A",
          "gd": "B",
          "order": 71
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "B",
          "gd": "D*",
          "order": 72
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "B",
          "gd": "D",
          "order": 73
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D1",
          "order": 74
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D2",
          "order": 75
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "D3",
          "order": 76
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "M1",
          "order": 77
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "P",
          "gd": "M2",
          "order": 78
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "I",
          "gd": "7",
          "order": 79
        },
        {
          "nc": 13,
          "section": "GCE/PreU/BTEC/IBHL",
          "kpi": "(%) A*-B",
          "sc": "I",
          "gd": "6",
          "order": 80
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7",
          "sc": "I",
          "gd": "7",
          "order": 81
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7-6",
          "sc": "I",
          "gd": "7",
          "order": 82
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7-6",
          "sc": "I",
          "gd": "6",
          "order": 83
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7-5",
          "sc": "I",
          "gd": "7",
          "order": 84
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7-5",
          "sc": "I",
          "gd": "6",
          "order": 85
        },
        {
          "nc": 13,
          "section": "IBHL",
          "kpi": "(%) 7-5",
          "sc": "I",
          "gd": "5",
          "order": 86
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9",
          "sc": "G",
          "gd": "9",
          "order": 87
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-8",
          "sc": "G",
          "gd": "9",
          "order": 88
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-8",
          "sc": "G",
          "gd": "8",
          "order": 89
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-7",
          "sc": "G",
          "gd": "9",
          "order": 90
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-7",
          "sc": "G",
          "gd": "8",
          "order": 91
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-7",
          "sc": "G",
          "gd": "7",
          "order": 92
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-6",
          "sc": "G",
          "gd": "9",
          "order": 93
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-6",
          "sc": "G",
          "gd": "8",
          "order": 94
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-6",
          "sc": "G",
          "gd": "7",
          "order": 95
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-6",
          "sc": "G",
          "gd": "6",
          "order": 96
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-5",
          "sc": "G",
          "gd": "9",
          "order": 97
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-5",
          "sc": "G",
          "gd": "8",
          "order": 98
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-5",
          "sc": "G",
          "gd": "7",
          "order": 99
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-5",
          "sc": "G",
          "gd": "6",
          "order": 100
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-5",
          "sc": "G",
          "gd": "5",
          "order": 101
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "9",
          "order": 102
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "8",
          "order": 103
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "7",
          "order": 104
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "6",
          "order": 105
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "5",
          "order": 106
        },
        {
          "nc": 11,
          "section": "GCSE",
          "kpi": "(%) 9-4",
          "sc": "G",
          "gd": "4",
          "order": 107
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-8 / A*",
          "sc": "G",
          "gd": "9",
          "order": 108
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-8 / A*",
          "sc": "G",
          "gd": "8",
          "order": 109
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-8 / A*",
          "sc": "G",
          "gd": "A*",
          "order": 110
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-7 / A*-A",
          "sc": "G",
          "gd": "9",
          "order": 111
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-7 / A*-A",
          "sc": "G",
          "gd": "8",
          "order": 112
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-7 / A*-A",
          "sc": "G",
          "gd": "7",
          "order": 113
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-7 / A*-A",
          "sc": "G",
          "gd": "A*",
          "order": 114
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-7 / A*-A",
          "sc": "G",
          "gd": "A",
          "order": 115
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "9",
          "order": 116
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "8",
          "order": 117
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "7",
          "order": 118
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "6",
          "order": 119
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "A*",
          "order": 120
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "A",
          "order": 121
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-6 / A*-B",
          "sc": "G",
          "gd": "B",
          "order": 122
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "9",
          "order": 123
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "8",
          "order": 124
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "7",
          "order": 125
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "6",
          "order": 126
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "5",
          "order": 127
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "A*",
          "order": 128
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "A",
          "order": 129
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "B",
          "order": 130
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-5 / A*-C",
          "sc": "G",
          "gd": "C",
          "order": 131
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "9",
          "order": 132
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "8",
          "order": 133
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "7",
          "order": 134
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "6",
          "order": 135
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "5",
          "order": 136
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "4",
          "order": 137
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "A*",
          "order": 138
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "A",
          "order": 139
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "B",
          "order": 140
        },
        {
          "nc": 11,
          "section": "GCSE LEGACY",
          "kpi": "(%) 9-4 / A*-C",
          "sc": "G",
          "gd": "C",
          "order": 141
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*",
          "sc": "B",
          "gd": "D*",
          "order": 142
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*-D",
          "sc": "B",
          "gd": "D*",
          "order": 143
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*-D",
          "sc": "B",
          "gd": "D",
          "order": 144
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*-M",
          "sc": "B",
          "gd": "D*",
          "order": 145
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*-M",
          "sc": "B",
          "gd": "D",
          "order": 146
        },
        {
          "nc": 13,
          "section": "BTEC",
          "kpi": "(%) D*-M",
          "sc": "B",
          "gd": "M",
          "order": 147
        }
       ]
});


interface Cohort {
    nc:{list:{nc:number}[],index:number},
    subject:{list:{nc:number,sc:string,ss:string,sl:string}[],index:number},
    mySets:{list:{nc:number,g:string,sc:string,ss:string,sl:string}[],index:number},
    edit:{id:number,nc:number,sc:string,ss:string,sl:string,g:string,n:string,dt:number,ds:string,isEdit:boolean},
    exam:{list:{yr:number,nc:number}[],index:number},
    archive:{yrs:{yr:number,nc:number}[],yIndex:number,subjects:{yr:number,nc:number,sc:string,ss:string,sl:string}[],sIndex:number}
}
    
export const cohorts:Cohort = $state({
  
    nc:{list:[{nc:0}],index:0},
    subject:{list:[{nc:0,sc:'',ss:'',sl:''}],index:0},
    mySets:{list:[{nc:0,g:'',sc:'',ss:'',sl:''}],index:0},
    edit:{id:0,nc:0,sc:'',ss:'',sl:'',g:'',n:'',dt:0,ds:'',isEdit:false},
    exam:{list:[{yr:0,nc:0}],index:0},
    archive:{yrs:[{yr:0,nc:0}],yIndex:0,subjects:[{yr:0,nc:0,sc:'',ss:'',sl:''}],sIndex:0}
    
});









