<script>
import { onMount } from 'svelte';
import { todos } from '../../stores';
import { supabase } from '../supabaseClient';
import { throwable } from '../throwable';

export let session;

let thinking = true;

let text = '';

const addTodo = async () => {
    thinking = true;

    try {
        await throwable(supabase.from('todos').insert({
            done: false,
            text,
            user_id: session.user.id,
        }));

        text = '';
    } catch (error) {
        alert(error.message);
    } finally {
        thinking = false;
    }
};

const removeTodo = async (id) => {
    thinking = true;

    try {
        await throwable(supabase.from('todos').delete().eq('id', id));
    } catch (error) {
        alert(error.message);
    } finally {
        thinking = false;
    }
};

const updateTodo = async (id, changes) => {
    thinking = true;

    try {
        await throwable(supabase.from('todos').update(changes).eq('id', id));
    } catch (error) {
        alert(error.message);
    } finally {
        thinking = false;
    }
};

onMount(() => {
    const sync = async () => {
        thinking = true;

        try {
            const downloaded = await throwable(supabase.from('todos').select());
            // console.log(downloaded);
            todos.set(downloaded);
        } catch {
            alert('Synchronization failed.');
        } finally {
            thinking = false;
        }
    };

    const inserted = (payload) => {
        todos.update((todos) => [...todos, payload.new]);
    };

    const updated = (payload) => {
        todos.update((todos) => {
            const index = todos.findIndex((todo) => todo.id === payload.old.id);

            if (index === -1) {
                alert('Desync! Please refresh.');
                return;
            }

            todos[index] = payload.new;

            return todos;
        });
    };

    const removed = (payload) => {
        todos.update((todos) => {
            const index = todos.findIndex((todo) => todo.id === payload.old.id);

            if (index === -1) {
                alert('Desync! Please refresh.');
                return;
            }

            todos.splice(index, 1);

            return todos;
        });
    };

    const realtime = supabase
        .channel('public:todos')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'todos' }, inserted)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'todos' }, updated)
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'todos' }, removed)
        .subscribe();

    (async () => {
        await sync();
    })();

    return () => realtime.unsubscribe();
});
</script>

<form class="mb-2" on:submit|preventDefault={addTodo}>
    <input class="w-full" disabled={thinking} name="todo" type="text" placeholder="Learn something new..." bind:value={text} required>
</form>

<ul>
    {#each $todos as todo}
    <li class="flex mb-1">
        <label class="flex flex-col justify-center"><input disabled={thinking} type="checkbox" bind:checked={todo.done} on:change={() => updateTodo(todo.id, {done: todo.done})}></label>
        <input disabled={thinking} type="text" on:keyup={(e) => e.key === 'Enter' && e.target.blur()} class="grow mx-2 {todo.done ? 'line-through' : ''}" bind:value={todo.text} on:change={() => updateTodo(todo.id, {text: todo.text})}>
        <button disabled={thinking} class="bg-red-900 hover:bg-red-700" on:click={() => removeTodo(todo.id)}>
            <img src="1f5d1.svg" alt="Delete" class="h-4">
        </button>
    </li>
    {/each}
</ul>