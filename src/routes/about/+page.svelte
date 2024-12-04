<script lang="ts">

import * as util from '$lib/util';


let test =async()=>{
		let response = await fetch('/api/read', {
		    method: 'POST',
		    body: JSON.stringify({table:"group_table"}),
		    headers: {'content-type': 'application/json'}
	    });
		let res= await response.json();
		console.log(res);

		let unique = util.unique(res,['lv','yr']);
		console.log(unique);


		
		

};

</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="ailanthus" />
</svelte:head>



<section>
    <h4>about/</h4>
</section>


<p><button onclick={test}>Unique</button></p>


<style>

</style>