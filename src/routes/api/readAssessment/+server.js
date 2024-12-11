
import { supabase } from "$lib/supabaseClient";
import { json } from '@sveltejs/kit';





export async function POST({request}) {
    const req = await request.json();
    
    if(req.type==='subject') {

        const { data, error } = await supabase
        .from('assessment_table')
        .select('id,nc,n,dl,dt,sc,ss,sl,log,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)')
        .eq('nc',req.nc)
        .eq('sc',req.sc)
        .eq('ss',req.ss)
        .eq('isArchive',req.isArchive)
        .order('dt', { ascending: true })

        console.log(error);
        
        return json(data ?? []);

    }

    if(req.type==='nc') {

        const { data, error } = await supabase
        .from('assessment_table')
        .select('id,nc,n,dl,dt,sc,ss,sl,log,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)')
        .eq('nc',req.nc)
        .eq('isArchive',req.isArchive)
        .order('sc', { ascending: true })
        .order('sl', { ascending: true })
        .order('dt', { ascending: true })
        console.log(error);
        
        return json(data ?? []);

    }

    if(req.type==='id') {

        const { data, error } = await supabase
        .from('assessment_table')
        .select('id,nc,n,dl,dt,sc,ss,sl,log,gd,t,isLock,isGrade,isCore,result_table(id,log,aid,g,t,gd,pc,fb,pid,sn,pn)')
        .eq('id',req.id)
       
        console.log(error);
        
        return json(data ?? []);

    }

  
   
   
  
    

};