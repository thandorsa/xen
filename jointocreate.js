import config from './config.json' assert { type: 'json' };

const jointocreatemap = new Map();

export default function (client) {
  const description = {
    name: "jointocreate",
    filename: "jointocreate.js",
    version: "3.2"
  };

  new Promise(resolve => {
    setInterval(() => {
      resolve(2);
      try {
        const guild = client.guilds.cache.get(config.guildid);
        const channels = guild.channels.cache.map(ch => ch.id);
        for (let i = 0; i < channels.length; i++) {
          const key = `tempvoicechannel_${guild.id}_${channels[i]}`;
          if (jointocreatemap.get(key)) {
            var vc = guild.channels.cache.get(jointocreatemap.get(key));
            if (vc.members.size < 1) {
              jointocreatemap.delete(key);
              return vc.delete();
            }
          }
        }
      } catch {}
    }, 10000);
  });

  client.on("voiceStateUpdate", (oldState, newState) => {
    // Handle voiceStateUpdate logic here
  });

  async function jointocreatechannel(user) {
    await user.guild.channels.create(`${user.member.user.username}'s room`, {
      type: 'voice',
      parent: user.channel.parent.id,
    }).then(async vc => {
      user.setChannel(vc);
      jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
      await vc.overwritePermissions([
        {
          id: user.id,
          allow: ['MANAGE_CHANNELS'],
        },
        {
          id: user.guild.id,
          allow: ['VIEW_CHANNEL'],
        },
      ]);
    });
  }
}
