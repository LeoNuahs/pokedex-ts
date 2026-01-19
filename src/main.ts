import { startREPL } from "./repl.js";
import { initState } from "./state"

function main() {
    const state = initState();
    await startREPL(state);
}

main();
