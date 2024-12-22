import { readdirSync } from "fs";
import ascii from "ascii-table";

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

export default (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

        commands.forEach(async (file) => {
            try {
                const pullModule = await import(`../commands/${dir}/${file}`);
                const pull = pullModule.default;

                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } else {
                    table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                    return;  // Skip this command if it doesn't have a name
                }

                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
                }
            } catch (err) {
                console.error(`Error loading command ${file}: ${err}`);
            }
        });
    });

    //console.log(table.toString());
};
