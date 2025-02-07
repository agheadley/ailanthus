<script lang="ts">
 
   
	import Alert from '$lib/_Alert.svelte';
	import {usr} from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import {goto} from '$app/navigation';


   
  const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      } else {
        goto('/auth');
        usr.name='';
        usr.isAdmin=false;
        usr.isTeacher=false;
        usr.isPupil=false;
      }
      
    }


  let { data, children } = $props()
  let { supabase } = $derived(data)




  </script>
  


    
        {@render children()}
    
    
  <style>
  

  
  
  
  
  </style>