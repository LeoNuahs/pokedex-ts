import { object, string, number, boolean, InferType, mixed, array, ValidationError } from "yup";
import { Cache } from "./pokecache.js";

export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2";
    private cache: Cache;

    constructor(cacheInterval: number) {
        this.cache = new Cache(cacheInterval);
    }

    private async processApiResponse<T>(schema: any, response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        try {
            const body = await response.json();
            return await schema.validate(body, { stripUnknown: true }) as T;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new Error(`Error validating data: ${error.message}`);
            }

            if (error instanceof Error) {
                throw new Error(`Error parsing data: ${error.message}`);
            }

            throw error;
        }
    }

    async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
        const url = pageURL || `${PokeAPI.baseURL}/location-area/?offset=0&limit=20`;
        const cachedData = this.cache.get<ShallowLocations>(url);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
        });

        const data = await this.processApiResponse<ShallowLocations>(ShallowLocationsSchema, response);
        this.cache.add(url, data);
        return data;
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const trimmedName = locationName.trim();
        if (!trimmedName) {
            throw new Error(`Location name can't be empty!`);
        }

        const url = `${PokeAPI.baseURL}/location-area/${trimmedName}/`;
        const cachedData = this.cache.get<Location>(url);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
        });

        const data = await this.processApiResponse<Location>(LocationSchema, response);
        this.cache.add(url, data);
        return data;
    }

    async fetchPokemon(pokemonName: string): Promise<Pokemon> {
        const trimmedName = pokemonName.trim();
        if (!trimmedName) {
            throw new Error(`Pokemon name can't be empty!`);
        }

        const url = `${PokeAPI.baseURL}/pokemon/${trimmedName}/`;
        const cachedData = this.cache.get<Pokemon>(url);
        if (cachedData) {
            return cachedData;
        }

        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
        });
        const data = await this.processApiResponse<Pokemon>(PokemonSchema, response);
        this.cache.add(url, data);
        return data;
    }
}

export const ShallowLocationsSchema = object({
    count: number().required(),
    next: string().nullable().defined(),
    previous: string().nullable().defined(),
    results: array().of(object({
        name: string().required(),
        url: string().required(),
    })).required()
});

export const LocationSchema = object({
    id: number().required(),
    name: string().required(),
    game_index: number().required(),
    encounter_method_rates: array().of(object({
        encounter_method: object({
            name: string().required(),
            url: string().required(),
        }).required(),
        version_details: array().of(object({
            rate: number().required(),
            version: object({
                name: string().required(),
                url: string().required(),
            }).required(),
        })).required(),
    })).required(),
    location: object({
        name: string().required(),
        url: string().required(),
    }).required(),
    names: array().of(object({
        name: string().required(),
        language: object({
            name: string().required(),
            url: string().required(),
        }).required(),
    })).required(),
    pokemon_encounters: array().of(object({
        pokemon: object({
            name: string().required(),
            url: string().required(),
        }).required(),
        version_details: array().of(object({
            version: object({
                name: string().required(),
                url: string().required(),
            }).required(),
            max_chance: number().required(),
            encounter_details: array().of(object({
                min_level: number().required(),
                max_level: number().required(),
                condition_values: array().of(mixed()).required(),
                chance: number().required(),
                method: object({
                    name: string().required(),
                    url: string().required(),
                }).required(),
            })).required(),
        })).required(),
    })).required(),
});

export const PokemonSchema = object({
    id: number().required(),
    name: string().required(),
    base_experience: number().required(),
    height: number().required(),
    is_default: boolean().required(),
    order: number().required(),
    weight: number().required(),
    abilities: array().of(object({
        is_hidden: boolean().nullable(),
        slot: number().nullable(),
        ability: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
    })).required(),
    forms: array().of(object({
        name: string().nullable(),
        url: string().nullable(),
    })).required(),
    game_indices: array().of(object({
        game_index: number().nullable(),
        version: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
    })).required(),
    held_items: array().of(object({
        item: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
        version_details: array().of(object({
            rarity: number().nullable(),
            version: object({
                name: string().nullable(),
                url: string().nullable(),
            }).nullable(),
        })).nullable(),
    })).required(),
    location_area_encounters: string().required(),
    moves: array().of(object({
        move: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
        version_group_details: array().of(object({
            level_learned_at: number().nullable(),
            version_group: object({
                name: string().nullable(),
                url: string().nullable(),
            }).nullable(),
            move_learn_method: object({
                name: string().nullable(),
                url: string().nullable(),
            }).nullable(),
            order: number().nullable(),
        })).nullable(),
    })).required(),
    species: object({
        name: string().nullable(),
        url: string().nullable(),
    }).required(),
    sprites: object({
        back_default: string().nullable(),
        back_female: mixed().nullable(),
        back_shiny: string().nullable(),
        back_shiny_female: mixed().nullable(),
        front_default: string().nullable(),
        front_female: mixed().nullable(),
        front_shiny: string().nullable(),
        front_shiny_female: mixed().nullable(),
        other: object({
            dream_world: object({
                front_default: string().nullable(),
                front_female: mixed().nullable(),
            }).nullable(),
            home: object({
                front_default: string().nullable(),
                front_female: mixed().nullable(),
                front_shiny: string().nullable(),
                front_shiny_female: mixed().nullable(),
            }).nullable(),
            "official-artwork": object({
                front_default: string().nullable(),
                front_shiny: string().nullable(),
            }).nullable(),
            showdown: object({
                back_default: string().nullable(),
                back_female: mixed().nullable(),
                back_shiny: string().nullable(),
                back_shiny_female: mixed().nullable(),
                front_default: string().nullable(),
                front_female: mixed().nullable(),
                front_shiny: string().nullable(),
                front_shiny_female: mixed().nullable(),
            }).nullable(),
        }).nullable(),
        versions: object({
            "generation-i": object({
                "red-blue": object({
                    back_default: string().nullable(),
                    back_gray: string().nullable(),
                    front_default: string().nullable(),
                    front_gray: string().nullable(),
                }).nullable(),
                yellow: object({
                    back_default: string().nullable(),
                    back_gray: string().nullable(),
                    front_default: string().nullable(),
                    front_gray: string().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-ii": object({
                crystal: object({
                    back_default: string().nullable(),
                    back_shiny: string().nullable(),
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
                gold: object({
                    back_default: string().nullable(),
                    back_shiny: string().nullable(),
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
                silver: object({
                    back_default: string().nullable(),
                    back_shiny: string().nullable(),
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-iii": object({
                emerald: object({
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
                "firered-leafgreen": object({
                    back_default: string().nullable(),
                    back_shiny: string().nullable(),
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
                "ruby-sapphire": object({
                    back_default: string().nullable(),
                    back_shiny: string().nullable(),
                    front_default: string().nullable(),
                    front_shiny: string().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-iv": object({
                "diamond-pearl": object({
                    back_default: string().nullable(),
                    back_female: mixed().nullable(),
                    back_shiny: string().nullable(),
                    back_shiny_female: mixed().nullable(),
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
                "heartgold-soulsilver": object({
                    back_default: string().nullable(),
                    back_female: mixed().nullable(),
                    back_shiny: string().nullable(),
                    back_shiny_female: mixed().nullable(),
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
                platinum: object({
                    back_default: string().nullable(),
                    back_female: mixed().nullable(),
                    back_shiny: string().nullable(),
                    back_shiny_female: mixed().nullable(),
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-v": object({
                "black-white": object({
                    animated: object({
                        back_default: string().nullable(),
                        back_female: mixed().nullable(),
                        back_shiny: string().nullable(),
                        back_shiny_female: mixed().nullable(),
                        front_default: string().nullable(),
                        front_female: mixed().nullable(),
                        front_shiny: string().nullable(),
                        front_shiny_female: mixed().nullable(),
                    }).nullable(),
                    back_default: string().nullable(),
                    back_female: mixed().nullable(),
                    back_shiny: string().nullable(),
                    back_shiny_female: mixed().nullable(),
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-vi": object({
                "omegaruby-alphasapphire": object({
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
                "x-y": object({
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-vii": object({
                icons: object({
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                }).nullable(),
                "ultra-sun-ultra-moon": object({
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                    front_shiny: string().nullable(),
                    front_shiny_female: mixed().nullable(),
                }).nullable(),
            }).nullable(),
            "generation-viii": object({
                icons: object({
                    front_default: string().nullable(),
                    front_female: mixed().nullable(),
                }).nullable(),
            }).nullable(),
        }).nullable(),
    }).required(),
    cries: object({
        latest: string().nullable(),
        legacy: string().nullable(),
    }).required(),
    stats: array().of(object({
        base_stat: number().nullable(),
        effort: number().nullable(),
        stat: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
    })).required(),
    types: array().of(object({
        slot: number().nullable(),
        type: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
    })).required(),
    past_types: array().of(object({
        generation: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
        types: array().of(object({
            slot: number().nullable(),
            type: object({
                name: string().nullable(),
                url: string().nullable(),
            }).nullable(),
        })).nullable(),
    })).required(),
    past_abilities: array().of(object({
        generation: object({
            name: string().nullable(),
            url: string().nullable(),
        }).nullable(),
        abilities: array().of(object({
            ability: mixed().nullable(),
            is_hidden: boolean().nullable(),
            slot: number().nullable(),
        })).nullable(),
    })).required(),
});

export type ShallowLocations = InferType<typeof ShallowLocationsSchema>;
export type Location = InferType<typeof LocationSchema>;
export type Pokemon = InferType<typeof PokemonSchema>
