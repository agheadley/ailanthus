//import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request,locals}) {
    const req = await request.json();
    
   

    //console.log('INSERT req',JSON.stringify(req));
    const { data,error } = await locals.supabase
    .from(req.table)
    .insert(req.data)
    .select()

    //console.log(error);
    return json({data:data,error:error});
   
   
  
    

};