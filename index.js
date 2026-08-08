const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "welcome"
  );

  if (!channel) return;

  const memberNumber = member.guild.memberCount;

  const embed = new EmbedBuilder()
    .setTitle(`👋 WELCOME TO ${member.guild.name.toUpperCase()}`)
    .setDescription(
      `Bienvenue ${member} ! 🎉\n\n` +
      `🔥 Tu es notre **${memberNumber}ème membre** !\n` +
      `📖 Lis les règles et profite du serveur.`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .setFooter({
      text: `${member.guild.name} • Welcome System`
    })
    .setTimestamp();

  await channel.send({
    content: `🎉 Bienvenue ${member} !`,
    embeds: [embed]
  });
});
