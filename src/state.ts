import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js"

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State) => void;
};

export type State = {
    rl: Interface;
    cmds: Record<string, CLICommand>;
};

export function initState() {
    const state: State = {
        rl: createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "Pokedex > "
        }),
        cmds: getCommands()
    }

    return state;
}
