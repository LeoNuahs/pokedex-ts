import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js"
import { PokeAPI } from "./pokeapi.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
    rl: Interface;
    cmds: Record<string, CLICommand>;
    pokeapi: PokeAPI;
    nextLocationsURL: string;
    prevLocationsURL: string;
};

export function initState(millis: number) {
    const state: State = {
        rl: createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "Pokedex > "
        }),
        cmds: getCommands(),
        pokeapi: new PokeAPI(millis),
        nextLocationsURL: "https://pokeapi.co/api/v2/location-area/?offset=0&limit=20",
        prevLocationsURL: "",
    }

    return state;
}
