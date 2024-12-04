
import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request}) {
    const req = await request.json();
    
    
    let eq1 = ``;
    let eq2 =``;
    if(req?.eq[0] && req?.eq?.[1]) {
        eq1=req.eq[0];
        eq2=req.eq[1];
    }

    console.log("eq:",eq1,eq2);
    
    //const { data } = await supabase.from(req.table).select();
    const { data, error } = await supabase
        .from(req.table)
        .select()
        .eq(eq1,eq2)

    console.log(error);
       
    return json(data ?? []);
   
   
  
    

};