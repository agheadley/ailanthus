import { json } from '@sveltejs/kit';
import { SUPABASE_ANON_KEY} from '$env/static/private'

export const config = {
    runtime: 'edge', // this is a pre-requisite
  };

let headers= {
    'Access-Control-Request-Headers': '*',
    'Content-Type': 'application/json',
    'apikey': `${SUPABASE_ANON_KEY}`,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

const select=`id,nc,n,dl,dt,sc,ss,sl,log,gd,t,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)`;

//let url =`https://xhuyamsoabffrqjbhwsx.supabase.co/rest/v1/assessment_table?id=eq.1&select=*`;
//url  =`https://xhuyamsoabffrqjbhwsx.supabase.co/rest/v1/assessment_table?select=${select}`;

export async function POST({request}) {
    const req = await request.json();

    const url  =`https://xhuyamsoabffrqjbhwsx.supabase.co/rest/v1/assessment_table?id=eq.${req.id}&select=${select}`;
    let response = await fetch(url,{method: 'GET',headers: headers});
    let res=await response.json();
   
    //console.log(res);

    return json(res);
   
}