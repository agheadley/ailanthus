<script lang="ts">
import '../../app.css';
</script>


<div class="container">
    <header>
        <p></p>
		<p><a class="brand" href={'/'}>Ailanthus</a></p>
		
    </header>
    <p class="notice">Please sign in to use Ailanthus</p>



<form method="POST" action="?/login&redirect=/about">
  
  <p>
    <button >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
      Sign in with Microsoft
    </button>
  </p>
  
  <p>Sign in as local user (admins only)</p>
  <p>
    <input type="text" name="email" placeholder="email"/>
  </p>
  <p>
    <input type="password" name="password" placeholder="password"/>
  </p>
  <p>
    <button formaction={`?/signin`}>Sign In</button>
    <!--<button formaction={`?/signin&path=${encodeURIComponent('/about')}`}>Sign In</button>-->
    <button formaction="?/reset">Forgotten Password?</button>
    <button formaction="?/link">Email Link (No password)</button>
  </p>
  
</form>

</div>

<style>
    
.brand  {
	color:#0d47a1;
	font-size:2rem;
	font-weight:bold;
	text-decoration: none;
} 
</style>

<!-- &path=${encodeURIComponent('/about')} -->