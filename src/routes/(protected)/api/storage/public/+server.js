
//import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request,locals}) {
    const req = await request.json();
    const { data } = locals.supabase.storage.from('images').getPublicUrl(req.fileName);
    return json({url: data.publicUrl});
};