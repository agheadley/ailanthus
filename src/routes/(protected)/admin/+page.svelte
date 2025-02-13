<script lang="ts">
import {goto} from '$app/navigation';
import {config,usr,cohorts} from '$lib/state.svelte';
import {alert} from '$lib/state.svelte';
import * as assessment from '../assessments/assessment.svelte';
import * as util from '$lib/util';

import Reports from './Reports.svelte';
import Assessments from './Assessments.svelte';
import Intake from './Intake.svelte';


let status = $state({
    view:{index:0,list:['Reports','Assessments','Intake']},

});










$effect(() => {

            
});

</script>

<svelte:head>
    <title>Admin</title>
    <meta name="description" content="ailanthus" />
</svelte:head>

<p>
<span class="tab spacer">
    {#each status.view.list as item,index} 
    <a href={'javascript:void(0)'} onclick={()=>status.view.index=index} class={status.view.index===index ? 'selected' : ''}>{item}</a>&nbsp;&nbsp;
    {/each}
  
</span>
</p>


{#if status.view.list[status.view.index]==='Reports'}<Reports></Reports>{/if}
{#if status.view.list[status.view.index]==='Assessments'}<Assessments></Assessments>{/if}
{#if status.view.list[status.view.index]==='Intake'}<Intake></Intake>{/if}






<style>

</style>