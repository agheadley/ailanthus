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

let url =`https://xhuyamsoabffrqjbhwsx.supabase.co/rest/v1/assessment_table?id=eq.1&select=*`;
url  =`https://xhuyamsoabffrqjbhwsx.supabase.co/rest/v1/assessment_table?select=*`;

export async function GET() {

   
    let response = await fetch(url,{method: 'GET',headers: headers});
    let res=await response.json();
   
    //console.log(res);

    return json(res);
   
}