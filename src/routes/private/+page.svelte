<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData } from './$types'
    import { onMount } from 'svelte';
    import {usr} from '$lib/state.svelte';
	import { isRedirect } from '@sveltejs/kit';

    let { data } = $props()
    let { supabase, user } = $derived(data)
  

    const getAdmin=async(email:string):Promise<boolean>=>{
      let  { data, error } = await supabase
          .from('admin_table')
          .select()
          .eq('email', email)
          .limit(1)
          .single()
      
          return data?.email ? true : false;

    };

    const getTeacher=async(tid:string):Promise<boolean>=>{
      let  { data, error } = await supabase
          .from('teacher_table')
          .select()
          .eq('tid', tid)
          .limit(1)
          .single()
      
          return data?.tid ? true : false;

    };

    const getPupil=async(pid:string):Promise<boolean>=>{
      
      if(Number.isNaN(Number(pid))) return false;
      let  { data, error } = await supabase
          .from('pupil_table')
          .select()
          .eq('pid', Number(pid))
          .limit(1)
          .single()
      
          return data?.tid ? true : false;

    };


    onMount(async() => {


		  console.log('private/');
      usr.isAdmin=false;
      usr.isTeacher=false;
      usr.isPupil=false;
      usr.sal='';
      usr.sn='';
      usr.pn='';
      usr.name='';

      console.log('Identifying usr...');

      if(user?.email) {
        
        usr.name=user.email.indexOf('@') > -1 ? String(user.email.split('@')[0].toUpperCase()) : '';

        // testing
        usr.name='DB';

        if(await getPupil(usr.name)) {
          usr.isPupil=true;
          usr.isTeacher=false;
        }

        if(await getTeacher(usr.name)) {
          usr.isPupil=false;
          usr.isTeacher=true;
        }
          
        if(await getAdmin(user.email)) {
          usr.isPupil=false
          usr.isAdmin=true;
          usr.isTeacher=true;
        }

       
      }

      console.log(usr);




	});



  </script>
  
  <h1>Private page for user: {user?.email}</h1>


  <style>

  </style>