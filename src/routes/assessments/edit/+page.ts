import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {page} from '$app/state';

import {user,config} from '$lib/state.svelte';

export const load: PageLoad = ({ params }) => {
    console.log(page);
    
    let msg=`${page.url.pathname} USER ${user.name!=='' ? user.name : ''} ${user.isTeacher ? 'TEACHER' : ''} ${user.isAdmin ? 'ADMIN' : ''} ${user.isPupil ? 'PUPIL' : ''}`;
      
    if(!user.isTeacher || config.isReady===false) redirect(302, '/');
    else {
        console.log(msg);
        return {};
    }

   
};