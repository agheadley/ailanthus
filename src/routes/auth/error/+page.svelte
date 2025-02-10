<script lang="ts">
    import {goto} from '$app/navigation';
    import '../../../app.css';

    
    const home=()=>{
        goto('/')
    }
    
    
    </script>
    <div class="container">
        <header>
            <p></p>
            <p><a class="brand" href={'/'}>Ailanthus</a></p>
            
        </header>
    
        <p class="notice">Sign in error. Please try again.</p>
    
        <button onclick={home}>Home</button>
    

    </div>

    
<style>
    
    .brand  {
        color:#0d47a1;
        font-size:2rem;
        font-weight:bold;
        text-decoration: none;
    } 
</style>
    
    
    
    