<script lang="ts">
    import '../app.css';
	import { page } from '$app/state';
    import {goto} from '$app/navigation';
    

    const home=()=>{
        goto('/')
    }
   

</script>


<div class="container">
    <header>
        <p></p>
        <p><a class="brand" href={'/'}>Ailanthus</a></p>
        
    </header>

    <h4>Oops! This page is not active.</h4>
    <p><button onclick={home}>Home</button></p>

    <p class="notice">
        {#if page.error}
         {page.url.pathname} - ERROR {page.status} {page.error.message} 
        {/if}
    </p>

    

</div>


<style>

.brand  {
    color:#0d47a1;
    font-size:2rem;
    font-weight:bold;
    text-decoration: none;
} 
</style>



