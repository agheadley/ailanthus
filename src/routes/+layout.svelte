<script lang="ts">
	import '../app.css';
	import Alert from '$lib/_Alert.svelte';
	import {usr} from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import {goto} from '$app/navigation';
	 import { invalidate } from '$app/navigation'
  	import { onMount } from 'svelte'

	

	  let { data,children } = $props();
	  let { session, supabase } = $derived(data)

	
	  const reload=()=>{

	  };

</script>

	<div class="app">
	<!-- simple css adjusted so .container used instead of body - body margin:0 added too to appp.css-->
	<Alert></Alert>
	<div class="container">
	<header>
		
			<div><a class="brand" href={'javascript:void(0)'} onclick={reload}>Ailanthus</a></div>
			<div>
				<!--
				<span>
					{usr.name}  
					{#if usr.isAdmin}admin{:else if usr.isTeacher}teacher{:else}pupil{/if}
				</span>
				&nbsp;&nbsp;<a data-title="LOGOUT" href={'#'}>{@html icon.logout(24)}</a>
				-->
			</div>
		
		<nav>
			<!--
			{#if usr.isTeacher}
				{#if !isExam}
					<a href="/assessments">Assessments</a>
					<a href="/overview">Overview</a>
					<a href="/reports">Reports</a>
				{:else}
					<a href="/results">Results</a>
					<a href="/totals">Totals</a>
					<a href="/va">Value Added</a>
				{/if}
				
		
			{/if}
			{#if usr.isAdmin}
					<a href="/admin">Admin</a>
			{/if}
			{#if usr.isTeacher}
				<button onclick={switchMenu}>{#if isExam}Internal{:else}Exams{/if}</button>
			{/if}
				
			{#if usr.isPupil}
			<a href="/">Pupil</a>
			{/if}
			-->
		  </nav>
	  </header>
	
	  	<main>
			{@render children()}
	
		</main>
	
	  <footer>
		<p>Svelte5 - Typescript -  Supabase - <a href="https://simplecss.org/demo" target=”_blank”>SimpleCSS Guide</a> - Anthony Headley {#if usr.isAdmin} - <a href="/testbed">Testbed</a>{/if}</p>
	  </footer>
	</div>
</div>

	

<style>

.brand  {
	color:#0d47a1;
	font-size:2rem;
	font-weight:bold;
	text-decoration: none;
} 




</style>
