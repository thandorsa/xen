import { Client, EmbedBuilder } from "discord.js";
import db from "quick.db";
import { default_prefix, color } from "../config.json";
import client from "../bleed.js"; // Assuming this is your bot's main client file

client.on("messageCreate", async (message) => {
  if (message.partial || message.author.bot) return;

  // Fetch the prefix from the database or use the default
  let prefix = db.get(`prefix_${message.guild.id}`) || default_prefix;

  // If the message starts with the bot's prefix
  if (!message.content.startsWith(prefix)) return;

  // Check for AFK status of the author
  if (db.has(`afk-${message.author.id}+${message.guild.id}`)) {
    const info = db.get(`afk-${message.author.id}+${message.guild.id}`);
    await db.delete(`afk-${message.author.id}+${message.guild.id}`);
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#6495ED")
          .setDescription(`👋 ${message.author}: Welcome back, you're no longer **AFK**`),
      ],
    });
  }

  // Check if a mentioned user is AFK
  if (message.mentions.members.first()) {
    const mentionedUser = message.mentions.members.first();
    if (db.has(`afk-${mentionedUser.id}+${message.guild.id}`)) {
      const afkMessage = db.get(`afk-${mentionedUser.id}+${message.guild.id}`);
      const embed = new EmbedBuilder()
        .setColor("#6495ED")
        .setDescription(`😴 ${mentionedUser} is AFK: ${afkMessage}`);
      message.channel.send({ embeds: [embed] });
    }
  }

  // Respond to bot mention with prefix
  if (message.content.trim() === `<@${client.user.id}>` || message.content.trim() === `<@!${client.user.id}>`) {
    const prefixEmbed = new EmbedBuilder()
      .setDescription(`${message.author}: Guild prefix: \`${prefix}\``)
      .setColor("#6495ED");
    message.channel.send({ embeds: [prefixEmbed] });
    return;
  }

  // Extract command and arguments from the message
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Handle custom commands stored in the database
  const customCommands = db.get(`cmd_${message.guild.id}`);
  if (customCommands) {
    const foundCommand = customCommands.find((x) => x.name === cmd);
    if (foundCommand) {
      message.channel.send(foundCommand.response);
      return;
    }
  }

  // Handle normal commands
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (command) {
    command.run(client, message, args);
  }
});

// Example of a simple command
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "bleed") {
    message.channel.send("what");
  }
});
