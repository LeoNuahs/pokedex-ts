import { CLICommand } from "./command.js";

export function commandHelp(commands: Record<string, CLICommand>) {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:\n");

    for (const command in commands) {
        const name = commands[command].name;
        const description = commands[command].description;

        console.log(`${name}: ${description}`);
    }
}
