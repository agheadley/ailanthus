
//import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request,locals}) {
    const req = await request.json();
    

    const {data,error} =await locals.supabase.storage.from('private').createSignedUrl(req.fileName, 3600);
  
    return json(data ? {url:data.signedUrl,error:false} : {url:JSON.stringify(error),error:true} );



};