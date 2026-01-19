import { startREPL } from "./repl.js";
import { initState } from "./state"

async function main() {
    const state = initState();
    await startREPL(state);
}

main();
