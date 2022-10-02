import { createSignal } from 'solid-js';
import { pipe, subscribe } from "wonka";
import { Todo } from '../model/todo';
import { urqlClient } from '../urqlWsClient';

export const [todos, setTodos] = createSignal<Todo[]>([]);

const { unsubscribe } = pipe(
  urqlClient.subscription(`
      subscription { 
        todos { 
          id
          title
          completed 
        } 
      }
    `, {}),
  subscribe((result: any) => {
    console.log(result);
    if (result.data && result.data.todos) {
      setTodos(result.data.todos);
    }
  })
);

/* 
export const [todos, { refetch }] = createResource(() =>
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
 */