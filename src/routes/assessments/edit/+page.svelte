<script lang="ts">
import {cohorts,config} from '$lib/state.svelte';
import * as assessment from '$lib/assessment.svelte';

const data = {
    table:[]
};

 
    $effect(() => {
            (async () => {
                
                $inspect(cohorts.edit);

                
                
                data.table=await assessment.getEditTable();
                console.log(data.table);


		    })()
	});


</script>

<svelte:head>
    <title>Edit</title>
    <meta name="description" content="ailanthus" />
</svelte:head>


<p>
    {JSON.stringify(cohorts.edit)};
</p>

<style>

</style>