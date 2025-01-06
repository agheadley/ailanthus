<script lang="ts">

let data = {
    menu:{options:['table','list'],index:0}
};

</script>

<svelte:head>
	<title>Results</title>
	<meta name="description" content="ailanthus" />
</svelte:head>

<p class='tab'>
    <a data-title="2D view" href={'javascript:void(0)'} onclick={()=>data.menu.index=0} class={data.menu.index===0 ? 'selected' : ''}>Table</a>
    <a data-title="1D view" href={'javascript:void(0)'} onclick={()=>data.menu.index=1} class={data.menu.index===1 ? 'selected' : ''}>List</a>
</p>
<style>



</style>
