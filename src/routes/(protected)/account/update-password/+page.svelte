<script lang="ts">
import { onMount } from 'svelte'

let email='';

onMount( async () => {
    fetch('/auth/user')
            .then( response => response.json() )
            .then( data => { 
                email=data?.email ? data.email : ''; 
            } )
});


</script>



<form method="POST" action="?/reset">
<p class="notice">User {email}. Choose a new password.</p>
<p>
  <input type="password" name="password" placeholder="new password"/>
</p><p>
  <button formaction="?/reset">Reset Password</button>
</p>
</form>

<style>

</style>
