import { State } from "./state.js";

export async function commandExplore(state: State, ...args: string[]) {
    if (args.length <= 0) {
        throw new Error("Must have at least one argument");
    }

    const location = args[0];
    const result = await state.pokeapi.fetchLocation(location);

    console.log("Found Pokemon:");
    result.pokemon_encounters.forEach(({ version_details, pokemon }) => {
        console.log(` - ${pokemon.name}`);
    });
}
