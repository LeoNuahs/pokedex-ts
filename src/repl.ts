import { createInterface } from "readline";

export function startREPL() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > "
    });

    rl.prompt();

    rl.on("line", async (user_input) => {
        const words = cleanInput(user_input);

        if (words.length === 0) {
            rl.prompt();
            return;
        }

        const commandName = words[0];
        console.log(`Your commandName was: ${commandName}`);
        rl.prompt();
    });
}

export function cleanInput(words: string): string[] {
    return words
        .toLowerCase()
        .trim()
        .split(' ')
        .filter((word) => word.length > 0)
}
