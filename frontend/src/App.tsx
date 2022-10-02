import { Component } from 'solid-js';

import { NewTodo } from './components/newtodo';
import { TodoList } from './components/todolist';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <NewTodo />
      <TodoList />
    </div>
  );
};

export default App;
