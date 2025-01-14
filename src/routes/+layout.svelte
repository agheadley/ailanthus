<script lang="ts">
	import '../app.css';
	import Alert from '$lib/_Alert.svelte';
	import {user} from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import {goto} from '$app/navigation';

	let isExam:boolean = $state(false);

	let { children } = $props();

	let switchMenu=()=>{
		isExam = isExam===true ? false : true;
		if(isExam) goto('/results');
		else goto('/assessments'); 
	};

</script>

	<div class="app">
	<!-- simple css adjusted so .container used instead of body - body margin:0 added too to appp.css-->
	<Alert></Alert>
	<div class="container">
	<header>
		
		<div class="row">
			<div class="col"><a class="brand" href="/">Ailanthus</a></div>
			<div class="col">
				{#if user.isTeacher}
				<button onclick={switchMenu}>{#if isExam}Internal{:else}Exams{/if}</button>
				{/if}
				<span>
					{user.name}  
					{#if user.isAdmin}admin{:else if user.isTeacher}teacher{:else}pupil{/if}
				</span>
				&nbsp;&nbsp;<a data-title="LOGOUT" href={'#'}>{@html icon.logout(24)}</a>
			</div>
		</div>
		
		<nav>
			{#if user.isTeacher}
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
			{#if user.isAdmin}
					<a href="/admin">Admin</a>
			{/if}
			{#if user.isPupil}
			<a href="/">Pupil</a>
			{/if}
		  </nav>
	  </header>
	
	  	<main>
			{@render children()}
	
		</main>
	
	  <footer>
		<p>Svelte5 - Typescript -  Supabase - <a href="https://simplecss.org/demo" target=”_blank”>SimpleCSS Guide</a> - Anthony Headley {#if user.isAdmin} - <a href="/testbed">Testbed</a>{/if}</p>
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
