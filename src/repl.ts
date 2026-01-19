import { createInterface } from "readline";
import { getCommands } from "./commands.js";

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
        const commands = getCommands();
        const cmd = commands[commandName];

        if (!cmd) {
            console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
            rl.prompt();
            return;
        }

        try {
            cmd.callback(commands);
        } catch (error) {
            console.log(error);
        }

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
