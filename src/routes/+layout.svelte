<script lang="ts">
	import '../app.css';
	import Alert from '$lib/_Alert.svelte';
	import {user} from '$lib/state.svelte';
	import * as icon from '$lib/icon';

	let { children } = $props();
</script>

	<div class="app">
	<!-- simple css adjusted so .container used instead of body - body margin:0 added too to appp.css-->
	<Alert></Alert>
	<div class="container">
	<header>
		<div class="row">
			<div class="col"><a class="brand" href="/">Ailanthus</a></div>
			<div class="col"><span class="tag">{user.name}  {#if user.isAdmin}admin{:else if user.isTeacher}teacher{:else}pupil{/if}</span>
				&nbsp;&nbsp;<a data-title="LOGOUT" href={'#'}>{@html icon.logout(24)}</a>
			</div>
		</div>
		<nav>
			<a href="/assessments">Assessments</a>
			<a href="/admin">Admin</a>
			<a href="/testbed">Testbed</a>
			<a href="https://simplecss.org/demo" target=”_blank”>SimpleCSS Guide</a>
		  </nav>
	  </header>
	
	  	<main>
			{@render children()}
	
		</main>
	
	  <footer>
		<p>Svelte5 - Typescript -  Supabase - SimpleCSS - Anthony Headley</p>

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
