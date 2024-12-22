const { EmbedBuilder } = require("discord.js");
const pagination = require("discord.js-pagination");
const db = require("quick.db");
const { default_prefix, color } = require("../../config.json");

module.exports = {
  name: "help",

  run: async (client, message, args) => {
    let prefix = db.get(`prefix_${message.guild.id}`);
    if (!prefix) prefix = default_prefix;
    if (message.author.bot) return;

    const page1 = new EmbedBuilder()
      .setColor(color)
      .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
      .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
      .setTitle("Launch Pad")
      .setDescription(`To get information on a command, use \`${prefix}[command]\`\nNavigate pages with ⬅️ or ➡️`)
      .addFields(
        { name: `Want ${client.user.username} in your server?`, value: `[Invite Here](https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot)` },
        { name: "Latest News", value: "lol four more like poor xd ! rofl." }
      );

    const page2 = new EmbedBuilder()
      .setColor(color)
      .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
      .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
      .setTitle("Configuration Commands")
      .setDescription(`${prefix}altdentifier enable - enables altdentifer\n${prefix}prefix <prefix> - set guild command prefix`);

    const page3 = new EmbedBuilder()
      .setColor(color)
      .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
      .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
      .setTitle("Fun Commands")
      .setDescription(`${prefix}gnome - gnome the mentioned user\n${prefix}meme - sends a random meme`);

    // Add more pages as needed, following the same structure

    const pages = [page1, page2, page3];

    const emoji = ["⬅️", "➡️"];
    const timeout = 47000;

    pagination(message, pages, emoji, timeout);
  },
};
