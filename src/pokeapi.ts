import { object, string, number, InferType, mixed, array, ValidationError } from "yup";

export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2";

    constructor() {}

    private async processResponse<T>(schema: any, response: Response): Promise<T> {
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

        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
        });

        return this.processResponse<ShallowLocations>(ShallowLocationsSchema, response);
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const trimmedName = locationName.trim();

        if (!trimmedName) {
            throw new Error(`Location name can't be empty!`);
        }

        const response = await fetch(`${PokeAPI.baseURL}/location-area/${trimmedName}/`, {
            method: "GET",
            mode: "cors",
        });

        return this.processResponse<Location>(LocationSchema, response);
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

export type ShallowLocations = InferType<typeof ShallowLocationsSchema>;
export type Location = InferType<typeof LocationSchema>;
