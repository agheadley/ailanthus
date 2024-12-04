import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request}) {
    const req = await request.json();
    

    console.log('INSERT req',JSON.stringify(req));
    const { error } = await supabase
    .from(req.table)
    .insert(req.data)

    //console.log(error);
    return json(error ?? {});
   
   
  
    

};