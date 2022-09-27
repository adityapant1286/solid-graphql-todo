import { createClient as createWSClient } from 'graphql-ws';
import { createClient, defaultExchanges, subscriptionExchange } from '@urql/core';

export const wsClient = createWSClient({
    url: 'ws://its.urql:4000/graphql',
});


export const urqlClient = createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription(operation) {
                return {
                    subscribe: (sink) => {
                        const dispose = wsClient.subscribe(operation, sink);
                        return {
                            unsubscribe: dispose,
                        };
                    },
                };
            },
        })
    ]
});