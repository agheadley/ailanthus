<script lang="ts">


	import '../app.css';
	import Alert from '$lib/_Alert.svelte';
	import {usr} from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import {goto} from '$app/navigation';
	 import { invalidate } from '$app/navigation'
  	import { onMount } from 'svelte'

	  let isExam:boolean = $state(false);

   
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

const switchMenu=()=>{
  isExam = isExam===true ? false : true;
  if(isExam) goto('/private/results');
  else goto('/private/assessments'); 
};

const reload=()=>{
  isExam=false;
  goto('/private/assessments'); 
};



	  let { data,children } = $props();
	  let { session, supabase } = $derived(data)

	


</script>

	
	<!-- simple css adjusted so .container used instead of body - body margin:0 added too to appp.css-->
	<Alert></Alert>
	<div class="container">
	<header>
		<p></p>
		<p><a class="brand" href={'javascript:void(0)'} onclick={reload} >Ailanthus</a></p>
		  <nav>
        {#if usr.isTeacher}
          {#if !isExam}
            <a href="/private/assessments">Assessments</a>
            <a href="/private/overview">Overview</a>
            <a href="private/reports">Reports</a>
          {:else}
            <a href="private/results">Results</a>
            <a href="private/totals">Totals</a>
            <a href="/private/va">Value Added</a>
          {/if}
          
      
        {/if}
        {#if usr.isAdmin}
            <a href="/private/admin">Admin</a>
        {/if}
        {#if usr.isTeacher}
          <button onclick={switchMenu}>{#if isExam}Internal{:else}Exams{/if}</button>
        {/if}
          
        {#if usr.isPupil}
        <a href="/private/pupil">Pupil</a>
        {/if}
        {#if usr.name!==''}<a href={'javascript:void(0)'} onclick={logout}>{usr.name} {@html icon.logout(16)}</a>{/if}
        
        </nav>
	  </header>
	
	  	<main>
			{@render children()}
	
		</main>
	
	  <footer>
		<p>Svelte5 - Typescript -  Supabase - <a href="https://simplecss.org/demo" target=”_blank”>SimpleCSS Guide</a> - Anthony Headley {#if usr.isAdmin} - <a href="/testbed">Testbed</a>{/if}</p>
	  </footer>
	</div>


	

<style>

.brand  {
	color:#0d47a1;
	font-size:2rem;
	font-weight:bold;
	text-decoration: none;
} 




</style>
