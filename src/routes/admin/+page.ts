import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


import {user,config} from '$lib/state.svelte';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load: PageLoad = ({ params }) => {
    
      
    if(!user.isAdmin || config.isReady===false) redirect(302, '/');
    else {
        console.log('/admin');
        const msg=`USER ${user.name!=='' ? user.name : ''} ${user.isTeacher ? 'TEACHER' : ''} ${user.isAdmin ? 'ADMIN' : ''} ${user.isPupil ? 'PUPIL' : ''}`;
        
        console.log(msg);
        return {};
    }

   
};