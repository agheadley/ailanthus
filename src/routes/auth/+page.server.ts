import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

import {CALLBACK_URL} from '$env/static/private';

export const actions: Actions = {
  reset: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
  
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/auth/reset',
    })
    
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/auth/link')
    }
  },
  link: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
  
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
        emailRedirectTo: CALLBACK_URL,
      },
    })

    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/auth/link')
    }
  },
  signin: async ({ request, locals: { supabase } }) => {

    const urlParams = new URLSearchParams(request.url);
    const path = urlParams.get('path') as string;
    console.log('path',path);
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, `${path!==null ? path : '/'}`)
      //redirect(303, '/')
    }
  },
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/')
      
    }
  },
  login: async ({ request, locals: { supabase } }) => {
    //let redirect=request.url.searchParams.get('redirect')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${CALLBACK_URL}?path=${encodeURIComponent('/about')}`
      },
    })
    
    if (data.url) {
      redirect(302,data.url) // use the redirect API for your server framework
    }
    if(error) console.log(request,error);


    /*
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/private')
    }
    */
  },
}