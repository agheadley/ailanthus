<script lang="ts">
	import { page } from '$app/state';
</script>

<h4>Whoops! Something went wrong here!</h4>
<p class="notice">
	{#if page.error}
	PATH: {page.url.pathname} ERROR: {page.status} {page.error.message} 
	{/if}
</p>

