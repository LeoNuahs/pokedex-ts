import { State } from "./state.js";

export async function commandPokedex(state: State) {
    console.log("Your Pokedex:");
    for (const pokemonName in state.caught) {
        console.log(` - ${pokemonName}`);
    }
}
