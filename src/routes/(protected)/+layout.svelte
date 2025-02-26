<script lang="ts">
	import '../../app.css';
	import {goto} from '$app/navigation';
	import { usr } from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	import Alert from '$lib/_Alert.svelte';
	
	let { data,children } = $props();
	let { user} = $derived(data);

	let isExam:boolean = $state(false);

	const logout = async () => {
		goto('/auth/logout'); 
    }

	const switchMenu=()=>{
		isExam = isExam===true ? false : true;
		if(isExam) goto('/results');
		else goto('/assessments'); 
	};

</script>

<Alert></Alert>
<div class="container">
	<header>
	
			<p></p>
			<p><a class="brand" href={'/'}>Ailanthus</a></p>
			
		
		<nav>
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
		  <a href="/pupil">Pupil</a>
		  {/if}
		  
	
		<button onclick={logout}>{usr.name} {@html icon.logout()}</button>
		</nav>
	</header>


	<main>
		{@render children()}
	</main>
	<footer>
		<p>
			Anthony Headley / 2025
		</p>
	
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
