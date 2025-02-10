<script lang="ts">
	import '../../app.css';
	import {goto} from '$app/navigation';
	import { usr } from '$lib/state.svelte';
	import * as icon from '$lib/icon';
	let { data,children } = $props();
	let { user} = $derived(data);


	const logout = async () => {
		goto('/auth/logout'); 
    }

</script>

<div class="container">
	<header>
		<header>
			<p></p>
			<p><a class="brand" href={'/'}>Ailanthus</a></p>
			
		</header>
		<nav>
		<button onclick={logout}>{usr.name} {@html icon.logout()}</button>
		</nav>
	</header>


	<main>
		{@render children()}
	</main>
	<footer>
		<p>
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
