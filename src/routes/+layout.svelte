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
		<nav>
			<a href="/">Home</a>
			<a href="/assessments">Assessments</a>
			<a href="/testbed">Testbed</a>
			
			<a href="https://simplecss.org/demo" target=”_blank”>SimpleCSS Guide</a>
		  </nav>
		  <p>{user.pn} {user.sn}&nbsp;&nbsp;<a href={'#'}>{@html icon.logout()}</a></p>
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

</style>
