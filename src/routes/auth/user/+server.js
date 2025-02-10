import { json } from '@sveltejs/kit';

export const GET = async (event) => {
	
    const {
		url,
		locals: { supabase }
	} = event;
	
    const {data: { user }}= await supabase.auth.getUser();

    return json(user);

   
    


  
};