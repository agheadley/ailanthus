<script lang="ts">

let { data } = $props();




$effect(()=>{
	console.log('+page.svelte mounted');
	
	
});


const checkUser=async()=>{
	//console.log(user);
};

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<section>

	Testing 1,2,3 ...
</section>



<style>

</style>

