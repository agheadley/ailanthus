
//import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request,locals}) {
    const req = await request.json();
    
 
    const { data,error } = await locals.supabase
        .from(req.table)
        .upsert(req.data, { onConflict: 'id',ignoreDuplicates:false,defaultToNull:false})
        .select()
      


    console.log(error);
       
    return json(data ?? []);
   
   
  
    

};







