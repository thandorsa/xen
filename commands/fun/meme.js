const Discord = require('discord.js');
const { color } = require("../../config.json");

module.exports = {
  name: "meme",

  run: async (client, message, args) => {
    let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!mentionedMember) mentionedMember = message.member;

    const embed = new Discord.MessageEmbed();

    // Dynamically import 'got' and use it inside the async function
    try {
      const got = (await import('got')).default;  // Dynamic import for got

      got('https://www.reddit.com/r/memes/random/.json')
        .then(response => {
          const [list] = JSON.parse(response.body);
          const [post] = list.data.children;

          const permalink = post.data.permalink;
          const memeURL = `https://reddit.com${permalink}`;
          const memeImage = post.data.url;
          const memeTitle = post.data.title;

          embed.setTitle(`${memeTitle}`);
          embed.setURL(`${memeURL}`);
          embed.setColor(mentionedMember.displayHexColor || color);
          embed.setImage(`${memeImage}`);

          message.channel.send(embed);
        })
        .catch(console.error);

    } catch (error) {
      console.error("Failed to load 'got' module:", error);
    }
  }
};
