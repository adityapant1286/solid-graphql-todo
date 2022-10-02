import { Component, createSignal } from "solid-js";
import { urqlClient } from "../../urqlWsClient";

import styles from "./NewTodo.module.css";


export const NewTodo: Component = () => {
    const [title, setTitle] = createSignal('');

    const handleAdd = () => {
        if (title().trim().length < 1) {
            return;
        }

        const addTodo = async () => {
            await urqlClient.mutation(`
            mutation($title: String!) {
                addTodo(title: $title) {
                    id
                    title
                }
            }
        `,
                {
                    title: title()
                }
            ).toPromise();

            setTitle('');
        }
        addTodo();
    };

    return (
        <div class={styles.inputContainer}>
            <input type='text'
                class={styles.textInput}
                value={title()}
                oninput={(e) => setTitle(e.currentTarget.value)} />
            <button onclick={handleAdd}
                class={styles.button}>
                Add
            </button>
        </div>
    );
};