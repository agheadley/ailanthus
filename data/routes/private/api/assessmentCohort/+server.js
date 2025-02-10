import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request}) {
    const req = await request.json();
    if(req.table) console.log('req',req);

    //console.log('INSERT req',JSON.stringify(req));
    const { data, error } = await supabase.rpc('assessment_cohorts');
    //console.log(data);
    if(error) console.log(error);
    return json(data[0] ? data : []);
   
   
  
    

};