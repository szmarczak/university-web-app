<script>
import { supabase } from '../supabaseClient';
import { throwable } from '../throwable';

let processing = false;

let view = 'login';
let email = '';
let password = '';
let password2 = '';
let agreed = false;
let errorMessage = '';

const login = async () => {
    processing = true;
    errorMessage = '';

    try {
        await throwable(supabase.auth.signInWithPassword({
            email,
            password,
        }));
        // await goto('todos');
    } catch (error) {
        errorMessage = error.message;
    } finally {
        processing = false;
    }
};

const register = async () => {
    processing = true;
    errorMessage = '';

    try {
        if (password !== password2) {
            throw new Error('Passwords do not match');
        }

        if (!agreed) {
            throw new Error('Please check the checkbox');
        }

        await throwable(supabase.auth.signUp({
            email,
            password,
        }));
        // await goto('todos');
    } catch (error) {
        errorMessage = error.message;
    } finally {
        processing = false;
    }
};
</script>

<style lang="postcss">
p#title {
    @apply text-center text-white p-2;
}

p#error {
    @apply text-red-900 text-center;
}

form {
    @apply flex flex-col gap-2;
}
</style>

{#if view === 'login'}
<p id="title">Welcome</p>
<p id="error">{errorMessage}</p>
<form on:submit|preventDefault={login}>
    <input type="email" name="email" placeholder="Email" required bind:value={email} autocomplete="off">
    <input name="password" type="password" placeholder="Password" required bind:value={password}>
    <button disabled={processing}>Log in</button>
    <button disabled={processing} class="dark:bg-emerald-900" on:click={() => (view = 'register', errorMessage = '')}>Register</button>
</form>
{:else if view === 'register'}
<p id="title">Register</p>
<p id="error">{errorMessage}</p>
<form on:submit|preventDefault={register}>
    <input type="email" name="email" placeholder="Email" required bind:value={email} autocapitalize="off">
    <input name="password" type="password" placeholder="Password" required bind:value={password}>
    <input name="password2" type="password" placeholder="Repeat password" bind:value={password2} required>
    <div>
        <input name="agreement" id="agreement" type="checkbox" required bind:value={agreed}>
        <label for="agreement" class="text-white">I concur that I am not a bot</label>
    </div>
    <button class="dark:bg-emerald-900">Register</button>
    <button on:click={() => (view = 'login', errorMessage = '')}>I already have an account</button>
</form>
{/if}