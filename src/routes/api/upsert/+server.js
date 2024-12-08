
import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request}) {
    const req = await request.json();
    
 
    const { data,error } = await supabase
        .from(req.table)
        .upsert(req.data, { onConflict: 'id',ignoreDuplicates:false,defaultToNull:false})
        .select()
        //.eq('id', req.id);



    console.log(error);
       
    return json(data ?? []);
   
   
  
    

};







