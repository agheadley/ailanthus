import { redirect } from '@sveltejs/kit';


export const GET = async (event) => {
	
    const {
		url,
		locals: { supabase }
	} = event;
	
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error,url);
      throw redirect(303, '/auth/error');
    } else {
        throw redirect(303, '/auth');
    }
    


  
};