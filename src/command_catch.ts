import { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("You must provide a Pokemon name");
    }

    const pokemonName = args[0];
    const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

    console.log(`Throwing a Pokeball at ${pokemonName}...`);

    const score = Math.floor(Math.random() * pokemon.base_experience);
    if (score > 40) {
        console.log(`${pokemonName} escaped!`);
        return;
    }

    console.log(`${pokemonName} was caught!`);
    console.log(`You may now inspect it with the inspect command.`);
    state.caught[pokemonName] = pokemon;
}
