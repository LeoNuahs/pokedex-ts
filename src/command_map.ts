import { State } from "./state.js";

export async function commandMap(state: State) {
    const next = state.nextLocationsURL;
    const data = await state.pokeapi.fetchLocations(next);
    const locations = data.results;

    state.nextLocationsURL = data.next ?? "";
    state.prevLocationsURL = data.previous ?? "";

    locations.forEach((location) => console.log(location.name));
}

export async function commandMapB(state: State) {
    if (!state.prevLocationsURL) {
        throw new Error("You're on the first page!");
    }

    const prev = state.prevLocationsURL;
    const data = await state.pokeapi.fetchLocations(prev);
    const locations = data.results;

    state.nextLocationsURL = data.next ?? "";
    state.prevLocationsURL = data.previous ?? "";

    locations.forEach((location) => console.log(location.name));
}
