import { State } from "./state.js";

export async function commandInspect(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("You must provide a Pokemon name!");
    }

    const pokemonName = args[0];
    const pokemon = state.caught[pokemonName];

    if (!pokemon) {
        console.log(`you have not caught that pokemon`);
        return;
    }

    console.log(`Name: ${pokemon.name}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
    console.log(`Stats:`);
    pokemon.stats.forEach((statInfo) => {
        console.log(`  -${statInfo.stat?.name}: ${statInfo.base_stat}`);
    });
    console.log(`Types:`);
    pokemon.types.forEach((typeInfo) => {
        console.log(`  - ${typeInfo.type?.name}`);
    });
}
