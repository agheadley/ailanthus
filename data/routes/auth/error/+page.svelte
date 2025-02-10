<script lang="ts">
import {goto} from '$app/navigation';

const home=()=>{
    goto('/')
}


</script>


<p class="notice">Sign in error. Please try again.</p>

<button onclick={home}>Home</button>

