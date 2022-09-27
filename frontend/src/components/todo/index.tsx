import { Component } from "solid-js";
import { TodoProps } from "../../model/todoProps";
import { refetch } from "../../state";
import { urqlClient } from "../../urqlWsClient";
import styles from './Todo.module.css';


export const Todo: Component<TodoProps> = (props: TodoProps) => {

    const toggleCompleted = async (id: string) => {
        await urqlClient.mutation(`
            mutation($id: ID!) {
                toggleTodo(id: $id) {
                    id
                }
            }
        `,
            { id }
        ).toPromise();
        refetch();
    };

    return (
        <div>
            <input id={props.todo.id}
                type="checkbox"
                class={styles.checkbox}
                checked={props.todo.completed}
                onclick={() => toggleCompleted(props.todo.id)}
            />
            <span class={props.todo.completed ? styles.completed : styles.notCompleted}>
                {props.todo.title}
            </span>
        </div>
    );
}