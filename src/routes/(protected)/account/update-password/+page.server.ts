import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

import {CALLBACK_URL} from '$env/static/private';

export const actions: Actions = {
  reset: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    //const email = formData.get('email') as string
    const password = formData.get('password') as string
    console.log('resetting password...')
    const { data, error } = await supabase.auth.updateUser({
        password:password
    });
    if (error) {
      console.error('ERROR updating user password');
      redirect(303, '/auth/error')
    } else {
      redirect(303,'/auth/logout')
    }
  },
 
}