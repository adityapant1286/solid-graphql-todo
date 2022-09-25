import { createServer } from "graphql-yoga";
import { schema } from "./src/schema";

async function main() {
    await createServer({ schema }).start();
}

main();