//import type { LayoutLoad } from './$types'

export const load = async ({ fetch }) => {
    console.log('+layout.ts');
    
    const r = await fetch(`/auth/user`);
	const user = await r.json();





	return {user};
	//return { user, session: data.session };
    
};