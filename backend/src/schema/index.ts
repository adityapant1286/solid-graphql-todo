import { createPubSub, PubSub } from 'graphql-yoga';
import { Todo } from "./types";

let todos = [
    {
        id: "1",
        title: "Learn GraphQL + Solidjs",
        completed: false
    }
];

// channel
const TODOS_CHANNEL = "TODOS_CHANNEL";

// pubsub
export const pubSub = createPubSub();

const publishToChannel = (data: any) => pubSub.publish(TODOS_CHANNEL, data);


// Type def
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

    type Subscription {
        todos: [Todo!]
    }
`];

// Resolvers
const resolvers = {
    Query: {
        getTodos: () => todos
    },
    Mutation: {
        addTodo: (_: unknown, { title }: Todo, { pubSub }: any) => {
            const newTodo = {
                id: "" + (todos.length + 1),
                title,
                completed: false
            };
            todos.push(newTodo);
            pubSub.publish(TODOS_CHANNEL, { todos });
            // publishToChannel({ todos });
            return newTodo;
        },
        toggleTodo: (_: unknown, { id }: Todo, { pubSub }: any) => {
            const todo = todos.find(todo => todo.id === id);
            if (!todo) {
                throw new Error("Todo not found");
            }
            todo.completed = !todo.completed;
            pubSub.publish(TODOS_CHANNEL, { todos });
            // publishToChannel({ todos });
            return todo;
        },
        removeTodo: (_: unknown, { id }: Todo, { pubSub }: any) => {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            const toBeDelete = todos[todoIndex];
            todos = [...todos.slice(0, todoIndex), ...todos.slice(todoIndex + 1)];
            pubSub.publish(TODOS_CHANNEL, { todos });
            // publishToChannel({ todos });
            return toBeDelete;
        }
    },
    Subscription: {
        todos: {
            subscribe: () => {
                const res = pubSub.subscribe(TODOS_CHANNEL);
                publishToChannel({ todos });
                return res;
            }
        },
    },
};


// export const schema = makeExecutableSchema({
//     resolvers,
//     typeDefs
// });

export const schema = {
    resolvers,
    typeDefs
};

