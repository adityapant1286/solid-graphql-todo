import { createServer } from "graphql-yoga";
import { ExecutionArgs, execute, subscribe } from "graphql";
import { schema } from "./src/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

async function main() {
    const gql_yoga_server = createServer({
        schema,
        graphiql: {
            subscriptionsProtocol: "WS"
        }
    });

    const httpServer = await gql_yoga_server.start();

    type EnvelopedExecutionArgs = ExecutionArgs & {
        rootValue: {
            execute: typeof execute;
            subscribe: typeof subscribe;
        };
    };


    useServer(
        {
            execute: (args) => (args as EnvelopedExecutionArgs).rootValue.execute(args),
            subscribe: (args) => (args as EnvelopedExecutionArgs).rootValue.subscribe(args),
            onSubscribe: async (ctx: any, msg: any) => {
                const { schema, execute, subscribe, contextFactory, parse, validate } = gql_yoga_server.getEnveloped(ctx);

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
            }
        },
        new WebSocketServer({
            server: httpServer,
            path: gql_yoga_server.getAddressInfo().endpoint
        })
    );

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});