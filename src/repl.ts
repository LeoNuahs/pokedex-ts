import { State } from "./state.js";

export async function startREPL(state: State) {
    state.rl.prompt();

    state.rl.on("line", async (user_input) => {
        const words = cleanInput(user_input);

        if (words.length === 0) {
            state.rl.prompt();
            return;
        }

        const [commandName, ...args] = words;
        const commands = state.cmds;
        const cmd = commands[commandName];

        if (!cmd) {
            console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
            state.rl.prompt();
            return;
        }

        try {
            await cmd.callback(state, ...args);
        } catch (error) {
            console.log(error);
        }

        state.rl.prompt();
    });
}

export function cleanInput(words: string): string[] {
    return words
        .toLowerCase()
        .trim()
        .split(' ')
        .filter((word) => word.length > 0)
}
