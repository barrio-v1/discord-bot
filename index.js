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

client.once("ready", () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "welcome"
  );

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 Welcome !")
    .setDescription(`Bienvenue ${member} dans **${member.guild.name}** 🎉`)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor("Blue");

  channel.send({ embeds: [embed] });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("🏓 Pong !");
  }

  if (message.content === "!ticket") {
    const embed = new EmbedBuilder()
      .setTitle("🎫 Support")
      .setDescription("Clique sur le bouton ci-dessous pour ouvrir un ticket.")
      .setColor("Blue");

    const button = new ButtonBuilder()
      .setCustomId("open_ticket")
      .setLabel("Open Ticket")
      .setEmoji("🎫")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "open_ticket") {
    const guild = interaction.guild;

    const existing = guild.channels.cache.find(
      ch => ch.name === `ticket-${interaction.user.id}`
    );

    if (existing) {
      return interaction.reply({
        content: `❌ عندك Ticket مفتوح: ${existing}`,
        ephemeral: true
      });
    }

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,

      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    const close = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(close);

    await channel.send({
      content: `${interaction.user}`,
      embeds: [
        new EmbedBuilder()
          .setTitle("🎫 Ticket")
          .setDescription("مرحبا! شرح لينا المشكل ديالك هنا، والـ Staff غادي يعاونك.")
          .setColor("Blue")
      ],
      components: [row]
    });

    await interaction.reply({
      content: `✅ Ticket créé : ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.customId === "close_ticket") {
    await interaction.reply("🔒 Ticket غادي يتسد...");

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 3000);
  }
});

client.login(process.env.TOKEN);
