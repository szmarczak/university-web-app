<svelte:head>
    <title>Todos</title>
</svelte:head>

<script>
import Welcome from '$lib/components/Welcome.svelte';
import Todos from '$lib/components/Todos.svelte';
import { page } from '$app/stores';
import { supabase } from '../lib/supabaseClient';
import { todos } from '../stores';

const logout = async () => {
    try {
        await supabase.auth.signOut();

        todos.set([]);
    } catch (error) {
        alert(error.message);
    }
};
</script>

<style lang="postcss">
form {
    @apply flex flex-col gap-2 sm:w-80;
}
</style>

<section class="flex-1 self-end">
    {#if $page.data.session}
    <button class="rounded-t-none rounded-r-none" on:click={logout}>Logout</button>
    {/if}
</section>

<main class="flex-1 flex flex-col justify-center container max-w-lg">
<div class="w-full">
    <h1 class="-skew-y-6 text-white bg-emerald-900 font-bold text-5xl p-4 my-8 text-center rounded w-fit mx-auto">Todos</h1>

    {#if !$page.data.session}
    <Welcome></Welcome>
    {:else}
    <Todos session={$page.data.session}></Todos>
    {/if}
</div>
</main>

<footer class="flex-1"></footer>