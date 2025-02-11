//import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


import {usr,config} from '$lib/state.svelte';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load= ({ params }) => {
    
      
    if(!usr.isTeacher || config.isReady===false) redirect(302, '/private');
    else {
        console.log('/va');
        const msg=`usr ${usr.name!=='' ? usr.name : ''} ${usr.isTeacher ? 'TEACHER' : ''} ${usr.isAdmin ? 'ADMIN' : ''} ${usr.isPupil ? 'PUPIL' : ''}`;
        
        console.log(msg);
        return {};
    }

   
};