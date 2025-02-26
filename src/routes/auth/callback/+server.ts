import { redirect } from '@sveltejs/kit';
import { type EmailOtpType } from '@supabase/supabase-js'
export const GET = async (event) => {
    const {
        url,
        locals: { supabase }
    } = event;
    const code = url.searchParams.get('code') as string;
    const route = url.searchParams.get('route') as string ?? '';
    const next = url.searchParams.get('next') ?? '/';
    const token_hash = url.searchParams.get('token_hash') as string;
    const type = url.searchParams.get('route') as EmailOtpType | null

    console.log('CALLBACK....');
    //console.log(event);
    console.log('auth/callback code', code);
    console.log('auth/callback next', next);
    console.log('auth/callback route', route);

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            throw redirect(303, `/${next.slice(1)}`);
        }
    }

    if(route==='recovery') {
        console.log('RECOVERY...');
        console.log('auth/callback token_hash', token_hash);
        console.log('auth/callback type', type);
        if (token_hash && type) {
            const { error } = await supabase.auth.verifyOtp({ token_hash, type })
            if (!error) {
              //redirectTo.searchParams.delete('next')
              redirect(303, '/account/update-password')
              console.log(error);
            }
          }
       
       
    }

    // return the user to an error page with instructions
    throw redirect(303, '/auth/error');
};

