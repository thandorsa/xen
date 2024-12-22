import { readdirSync, statSync } from "fs";
import path from "path";  // To join paths correctly in a cross-platform manner

export default (client) => {
  // Read the files in the 'events' directory
  readdirSync("./events/").forEach(file => {
    const filePath = path.join("./events/", file);
    const stats = statSync(filePath);

    // Check if the current path is a directory
    if (stats.isDirectory()) {
      const events = readdirSync(filePath).filter(file => file.endsWith(".js"));

      // Loop through the events and import them
      events.forEach(async (eventFile) => {
        try {
          const pullModule = await import(`../events/${file}/${eventFile}`);
          const pull = pullModule.default; // If using default export from event files

          if (pull.name) {
            client.events.set(pull.name, pull);
          } else {
            console.log(`❌ Event file ${eventFile} is missing a name`);
          }
        } catch (err) {
          console.error(`Error loading event ${eventFile}: ${err}`);
        }
      });
    } else {
      // If it's a file and not a directory, you can directly load it
      if (file.endsWith(".js")) {
        (async () => {
          try {
            const pullModule = await import(`../events/${file}`);
            const pull = pullModule.default;

            if (pull.name) {
              client.events.set(pull.name, pull);
            } else {
              console.log(`❌ Event file ${file} is missing a name`);
            }
          } catch (err) {
            console.error(`Error loading event file ${file}: ${err}`);
          }
        })(); // Immediately invoked async function
      }
    }
  });
};
