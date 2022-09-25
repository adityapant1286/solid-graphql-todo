import { makeExecutableSchema } from '@graphql-tools/schema';
import { Todo } from "./types";

let todos = [
    {
        id: "1",
        title: "Learn GraphQL + Solidjs",
        completed: false
    }
];

const typeDefs = [`
    type Todo {
        id: ID!
        title: String!
        completed: Boolean!
    }

    type Query {
        getTodos: [Todo]!
    }

    type Mutation {
        addTodo(title: String!): Todo!
        removeTodo(id: ID!): Todo!
        toggleTodo(id: ID!): Todo!
    }
`];

const resolvers = [{
    Query: {
        getTodos: () => todos
    },
    Mutation: {           
        addTodo: (_: unknown, { title }: Todo ) => {               
            const newTodo = {                   
                id: "" + todos.length + 1,                   
                title,                   
                completed: false                   
            };                   
            todos.push(newTodo);
            return newTodo;
        },
        toggleTodo: (_: unknown, { id }: Todo ) => {               
            const todo = todos.find(todo => todo.id === id);
            if (!todo) {                   
                throw new Error("Todo not found");                   
            }                   
            todo.completed = !todo.completed;                   
            return todo
        },
        removeTodo: (_: unknown, { id }: Todo ) => {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            const toBeRemoved = todos[todoIndex];

            todos = [...todos.slice(0, todoIndex), ...todos.slice(todoIndex+1)]

            return toBeRemoved;
        }
    }
}];

export const schema = makeExecutableSchema({           
    resolvers,
    typeDefs
});

