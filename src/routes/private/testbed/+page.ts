import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


import {usr,config} from '$lib/state.svelte';

export const load: PageLoad = ({ params }) => {
    
      
    if(!usr.isAdmin || config.isReady===false) redirect(302, '/');
    else {
        console.log('/testbed');
        let msg=`usr ${usr.name!=='' ? usr.name : ''} ${usr.isTeacher ? 'TEACHER' : ''} ${usr.isAdmin ? 'ADMIN' : ''} ${usr.isPupil ? 'PUPIL' : ''}`;
        
        console.log(msg);
        return {};
    }

   
};