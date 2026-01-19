import { State } from "./state.js";

export function commandHelp(state: State) {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:\n");

    const commands = state.cmds;

    for (const command in commands) {
        const name = commands[command].name;
        const description = commands[command].description;

        console.log(`${name}: ${description}`);
    }
}
