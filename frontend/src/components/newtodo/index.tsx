import { Component, createSignal } from "solid-js";
import { refetch } from "../../state";
import { urqlClient } from "../../urqlWsClient";

import styles from "./NewTodo.module.css";


export const NewTodo: Component = () => {
    const [title, setTitle] = createSignal('');

    const handleAdd = async () => {
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

        refetch();
        setTitle('');
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