<script lang="ts">

let { data } = $props();
//let { supabase, user } = $derived(data);
let { user } = $derived(data);

$effect(()=>{

});

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>

	<p class="notice">Building application data. Please wait ...</p>
</section>

<p>{user?.email}</p>

<p></p>
<style>
</style>
