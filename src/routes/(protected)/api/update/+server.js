
//import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request,locals}) {
    const req = await request.json();
    
 
    //console.log(req);

    const { data, error } = await locals.supabase
        .from(req.table)
        .update(req.update)
        .eq('id',req.id)
        .select()



    console.log(error);
       
    return json(data ?? []);
   
   
  
    

};







