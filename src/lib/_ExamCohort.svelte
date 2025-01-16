<script lang="ts">
    import {cohorts} from '$lib/state.svelte';
</script>

<select bind:value={cohorts.exam.index}>
    {#each cohorts.exam.list as row,rowIndex}
        <option value={rowIndex}>{row.yr} / {row.nc}</option>
    {/each}
</select>

<style>

</style>