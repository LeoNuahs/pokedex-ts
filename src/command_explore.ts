import { State } from "./state.js";

export async function commandExplore(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("You must provide a location name");
    }

    const location_name = args[0];
    const location = await state.pokeapi.fetchLocation(location_name);

    console.log("Found Pokemon:");
    location.pokemon_encounters.forEach(({ version_details, pokemon }) => {
        console.log(` - ${pokemon.name}`);
    });
}
