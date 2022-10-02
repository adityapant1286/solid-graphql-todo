import { createServer } from "graphql-yoga";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { schema, pubSub } from "./src/schema";
import { execute, ExecutionArgs, subscribe } from "graphql";

async function main() {
    const yogaApp = createServer({
        schema,
        graphiql: {
            subscriptionsProtocol: 'WS', // use WebSockets instead of SSE
        },
        context: { pubSub }
    });

    const server = await yogaApp.start();
    const wsServer = new WebSocketServer({
        server,
        path: yogaApp.getAddressInfo().endpoint
    });

    type EnvelopedExecutionArgs = ExecutionArgs & {
        rootValue: {
            execute: typeof execute;
            subscribe: typeof subscribe;
        };
    };

    useServer(
        {
            execute: (args: any) => (args as EnvelopedExecutionArgs).rootValue.execute(args),
            subscribe: (args: any) => (args as EnvelopedExecutionArgs).rootValue.subscribe(args),
            onSubscribe: async (ctx, msg) => {
                const { schema, execute, subscribe, contextFactory, parse, validate } =
                    yogaApp.getEnveloped(ctx);

                const args: EnvelopedExecutionArgs = {
                    schema,
                    operationName: msg.payload.operationName,
                    document: parse(msg.payload.query),
                    variableValues: msg.payload.variables,
                    contextValue: await contextFactory(),
                    rootValue: {
                        execute,
                        subscribe,
                    },
                };

                const errors = validate(args.schema, args.document);
                if (errors.length) return errors;
                return args;
            },
        },
        wsServer,
    );

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});