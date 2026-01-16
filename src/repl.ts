export function cleanInput(words: string): string[] {
    return words
        .trim()
        .split(' ')
        .filter((word) => word.length > 0)
        .map((word) => word.trim().toLowerCase());
}
