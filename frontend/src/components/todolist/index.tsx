import { Component, For } from "solid-js";
import { Todo } from "../todo";
import { Todo as TodoData } from '../../model/todo';
import { todos } from "../../state";
import styles from './TodoList.module.css';


export const TodoList: Component = () => {

    return (
        <div class={styles.dFlex}>
            <div class={styles.todoListContainer}>
                <For each={todos()}>
                    {(item: TodoData) => <Todo todo={item} />}
                </For>
            </div>
        </div>
    );
};