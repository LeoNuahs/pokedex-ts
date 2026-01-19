export type CacheEntry<T> = {
    createdAt: number;
    val: T;
};

export class Cache {
    #cache = new Map<string, CacheEntry<any>>();
    #reapIntervalId: NodeJS.Timeout | undefined = undefined;
    #interval: number;

    constructor(interval: number) {
        this.#interval = interval;
        this.#startReapLoop();
    }

    add<T>(key: string, val: T) {
        const entry: CacheEntry<T> = {
            createdAt: Date.now(),
            val: val
        }

        this.#cache.set(key, entry);
    }

    get<T>(key: string) {
        return this.#cache.get(key)?.val || undefined;
    }

    #reap() {
        this.#cache.forEach((val, key) => {
            const canReap = (Date.now() - val.createdAt) > this.#interval;
            if (canReap) {
                this.#cache.delete(key);
            };
        });
    }

    #startReapLoop() {
        this.#reapIntervalId = setInterval(() => {
            this.#reap()
        }, this.#interval);
    }

    stopReapLoop() {
        clearInterval(this.#reapIntervalId);
        this.#reapIntervalId = undefined;
    }
}
