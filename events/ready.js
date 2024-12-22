import client from "../bleed.js";

client.once("ready", () => {
  console.log(`${client.user.username} is now up and running!`);
  
  client.user.setActivity("discord.gg/four", {
    type: 0, // Use the appropriate enum value for activity type
    url: "https://www.twitch.tv/discord"
  });
});
