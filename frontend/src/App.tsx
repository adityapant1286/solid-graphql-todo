import { Component } from 'solid-js';
// import { createSignal } from 'solid-js';

import styles from './App.module.css';
import { NewTodo } from './components/newtodo';
import { TodoList } from './components/todolist';

// const [todos, setTodos] = createSignal<Todo[]>([]);


const App: Component = () => {
  return (
    <div class={styles.App}>
      <NewTodo />
      <TodoList />
    </div>
  );
};

export default App;
