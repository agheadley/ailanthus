<script lang="ts">
import { goto } from '$app/navigation';
    
import {cohorts,config} from '$lib/state.svelte';
import * as assessment from './../assessment.svelte';


interface Data  {
    assessment:{id:number,n:string,isLock:boolean,gd:{gd:string,pc:number,sc:string,pre:number}[],t:{t:number,w:number,p:string}[]},
    results:{id:number|null,pid:number,pn:string,sn:string,t:number[],gd:string,pc:number,fb:string}[]
}

const data : Data = {
    assessment:{id:0,n:'',isLock:true,gd:[{sc:'',gd:'',pc:0,pre:0}],t:[{t:0,w:0,p:''}]},
    results:[]
};

 
    $effect(() => {
            (async () => {
                if(config.isReady===false) goto(`/`);
    
                $inspect(cohorts.edit);

                
                
                const res=await assessment.getEditTable();
                data.assessment=res.assessment;
                data.results=res.results;
               

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