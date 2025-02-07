<script lang="ts">
 
   
	import Alert from '$lib/_Alert.svelte';
	import {usr} from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import {goto} from '$app/navigation';


   



  let { data, children } = $props()
  let { supabase } = $derived(data)




  </script>
  


    
        {@render children()}
    
    
  <style>
  

  
  
  
  
  </style>