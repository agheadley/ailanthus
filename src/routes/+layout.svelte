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
			<div class="col"><span class="brand">Ailanthus</span></div>
			<div class="col">{user.pn} {user.sn}&nbsp;&nbsp;<a href={'#'}>{@html icon.logout()}</a></div>
		</div>
		<nav>
			<a href="/">Home</a>
			<a href="/assessments">Assessments</a>
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

.brand {
	font-variant: small-caps;
	font-weight:bold;
}
</style>
