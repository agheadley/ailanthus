<script lang="ts">
	import { page } from '$app/state';
</script>

<h4>{page.url}</h4>
<p class="notice">
	{#if page.error}
		Error: {page.status} {page.error.message} 
	{/if}
</p>

