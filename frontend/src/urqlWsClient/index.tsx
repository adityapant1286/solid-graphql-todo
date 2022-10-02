import { createClient as createWSClient } from 'graphql-ws';
import { createClient, defaultExchanges, subscriptionExchange } from '@urql/core';

const wsClient = createWSClient({
    url: 'ws://localhost:4000/graphql',
});

const urqlClient = createClient({
    url: 'http://localhost:4000/graphql',
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (operation) => ({
                subscribe: (sink) => ({
                    unsubscribe: wsClient.subscribe(operation, sink)
                }),
            }),
        }),
    ],
});

export { urqlClient };