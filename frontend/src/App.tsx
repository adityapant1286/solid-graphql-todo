import { Component } from 'solid-js';
import { createResource, For, createSignal } from 'solid-js';
import { createClient } from '@urql/core';

import styles from './App.module.css';

const urqlClient = createClient({
  url: 'http://localhost:4000/graphql',
});


const [todos] = createResource(() =>
  urqlClient.query(`
          query {
            getTodos {
              id
              title
              completed
            }
          }
        `, {})
    .toPromise()
    .then(({ data }) => data.getTodos)
);

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const App: Component = () => {
  const [title, setTitle] = createSignal('');

  const handleAdd = async () => {
    console.log('handleAdd');
    await urqlClient.mutation(`
          mutation($title: String!) {
            addTodo(title: $title) {
              id
              title
              completed
            }
          }
        `,
      {
        title: title()
      }

    ).toPromise();

    setTitle('');
  };

  const toggleCompleted = ()


  return (
    <div class={styles.App}>
      <div class={styles.InputTodo}>
        <input type='text' class={styles.textInput} 
        value={title()} oninput={(e) => setTitle(e.currentTarget.value)} />
        <button onclick={handleAdd} class={styles.button}>Add</button>
      </div>
      <div class={styles.dFlex}>{title()}</div>
      <div class={styles.dFlex}>
        <div class={styles.TodoContainer}>
          <For each={todos()}>
            {(item: Todo) =>
              <div>
                <input id={item.id} type="checkbox" class={styles.checkbox} checked={item.completed} onclick={toggleCompleted} />
                <span>{item.title}</span>
              </div>
            }
          </For>
        </div>
      </div>
    </div>
  );
};

export default App;
