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

// ==========================================
// CONFIG
// ==========================================

const WELCOME_CHANNEL = "welcome";
const LOGS_CHANNEL = "logs";
const TICKET_CATEGORY = "tickets";

// Roles
const ROLE_NAMES = {
  mta: "MTA SAN",
  freefire: "FREE FIRE",
  minecraft: "MINECRAFT",
  valorant: "VALORANT",
  fivem: "FIVEM",
  fifa: "FIFA",
  creator: "CONTENT CREATOR",
  mgbboy: "MGB BOY",
  mgbqueen: "MGB QUEEN"
};


// ==========================================
// BOT READY
// ==========================================

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is online!`);
});


// ==========================================
// WELCOME
// ==========================================

client.on("guildMemberAdd", async (member) => {
  try {
    const channel = member.guild.channels.cache.find(
      ch => ch.name === WELCOME_CHANNEL
    );

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle(`👋 WELCOME TO ${member.guild.name.toUpperCase()}`)
      .setDescription(
        `Bienvenue ${member} ! 🎉\n\n` +
        `🔥 You're member **#${member.guild.memberCount}**!\n\n` +
        `📜 Don't forget to read the rules.\n` +
        `🎫 Need help? Open a ticket.\n` +
        `🎮 Choose your roles with the role panel.`
      )
      .setThumbnail(
        member.user.displayAvatarURL({
          dynamic: true,
          size: 512
        })
      )
      .setFooter({
        text: `${member.guild.name} • Welcome System`
      })
      .setTimestamp();

    await channel.send({
      content: `🎉 Welcome ${member}!`,
      embeds: [embed]
    });

    // LOG
    const logs = member.guild.channels.cache.find(
      ch => ch.name === LOGS_CHANNEL
    );

    if (logs) {
      const logEmbed = new EmbedBuilder()
        .setTitle("📥 Member Joined")
        .setDescription(
          `${member} joined the server.`
        )
        .addFields(
          {
            name: "👤 User",
            value: `${member.user.tag}`,
            inline: true
          },
          {
            name: "🆔 ID",
            value: member.id,
            inline: true
          }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      await logs.send({
        embeds: [logEmbed]
      });
    }

  } catch (error) {
    console.error("WELCOME ERROR:", error);
  }
});


// ==========================================
// MEMBER LEAVE LOG
// ==========================================

client.on("guildMemberRemove", async (member) => {
  try {
    const logs = member.guild.channels.cache.find(
      ch => ch.name === LOGS_CHANNEL
    );

    if (!logs) return;

    const embed = new EmbedBuilder()
      .setTitle("📤 Member Left")
      .setDescription(`${member.user.tag} left the server.`)
      .addFields({
        name: "🆔 ID",
        value: member.id
      })
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    await logs.send({
      embeds: [embed]
    });

  } catch (error) {
    console.error("LEAVE LOG ERROR:", error);
  }
});


// ==========================================
// COMMANDS
// ==========================================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;


  // ========================================
  // PING
  // ========================================

  if (message.content === "!ping") {
    return message.reply("🏓 Pong !");
  }


  // ========================================
  // RULES
  // ========================================

  if (message.content === "!rules") {

    const rules = `# 📜 LMGHARBA Community - Rules

**1. I7tiram faw9 kolchi.**
Kol member khaso y7tarem ga3 l'a3da2 w l'administration.

**2. Mamnou3 Seb w Toxicity.**
Ay sban, tah9ir, racism, aw kalam khayb mamnou3.

**3. Mamnou3 Spam.**
Mat3awedch nafs message bzaf w mat3merch chat b lspam.

**4. Mamnou3 Tchhir b Chi Community Okhra.**
Matncher 7ta server, Discord, aw page bla idn mn l'administration.

**5. Mamnou3 Cheats / Hacks.**
Ay wa7d tst3mel cheat, hack, aw exploit ghadi yt3a9eb.

**6. Ista3mel Channel lmonasib.**
Kol topic 3ando channel dyalo, matkhaletch lmawadi3.

**7. 7tarem l'Administration.**
Ila 3andek mochkil, ft7 ticket aw hder m3a staff b i7tiram.

**8. Mamnou3 Inti7al Chakhsiya.**
Matst3melch smiya aw profile dyal chi wa7ed bach tghalat nass.

**9. 7afed 3la Smiya dyal LMGHARBA Community.**
Ay tasarrof kaydir sou2 lcommunity ymken ykoun sabab f lban.

**10. Koun Active w Khlli Jaw Zwin.**
T3awen m3a l'a3da2, stamt3, w b3ed 3la lmachakil.

━━━━━━━━━━━━━━━━━━

⚠️ **Awel Mra:** Warning
⏳ **Tani Mra:** Mute / Kick
🚫 **Moukhalafat Kbira:** Temporary Ban aw Permanent Ban

━━━━━━━━━━━━━━━━━━

⚠️ Please respect everyone and enjoy the community!`;

    const embed = new EmbedBuilder()
      .setTitle("📜 LMGHARBA Community — Rules")
      .setDescription(rules)
      .setColor("Blue")
      .setFooter({
        text: "LMGHARBA Community • Respect Everyone"
      })
      .setTimestamp();

    return message.channel.send({
      embeds: [embed]
    });
  }


  // ========================================
  // TICKET PANEL
  // ========================================

  if (message.content === "!ticket") {

    const embed = new EmbedBuilder()
      .setTitle("🎫 LMGHARBA Support")
      .setDescription(
        "Besoin d'aide ?\n\n" +
        "Clique sur **Open Ticket** pour contacter le Staff.\n\n" +
        "🎫 Support\n" +
        "🛠️ Problems\n" +
        "📩 Questions"
      )
      .setColor("Blue")
      .setFooter({
        text: "LMGHARBA Support"
      });

    const button = new ButtonBuilder()
      .setCustomId("open_ticket")
      .setLabel("Open Ticket")
      .setEmoji("🎫")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(button);

    return message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }


  // ========================================
  // ROLE PANEL
  // ========================================

  if (message.content === "!roles") {

    const embed = new EmbedBuilder()
      .setTitle("🎮 Choose Your Roles")
      .setDescription(
        "اختار الـRole ديالك بالضغط على الزر.\n\n" +
        "🎮 **Games**\n" +
        "MTA SAN • FREE FIRE • MINECRAFT • VALORANT\n" +
        "FIVEM • FIFA\n\n" +
        "👑 **Community**\n" +
        "CONTENT CREATOR • MGB BOY • MGB QUEEN"
      )
      .setColor("Blue");

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("role_mta")
        .setLabel("MTA SAN")
        .setEmoji("🎮")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_freefire")
        .setLabel("FREE FIRE")
        .setEmoji("🔥")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_minecraft")
        .setLabel("MINECRAFT")
        .setEmoji("⛏️")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("role_valorant")
        .setLabel("VALORANT")
        .setEmoji("🎯")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("role_fivem")
        .setLabel("FIVEM")
        .setEmoji("🚗")
        .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("role_fifa")
        .setLabel("FIFA")
        .setEmoji("⚽")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("role_creator")
        .setLabel("CONTENT CREATOR")
        .setEmoji("🎥")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_mgbboy")
        .setLabel("MGB BOY")
        .setEmoji("👦")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("role_mgbqueen")
        .setLabel("MGB QUEEN")
        .setEmoji("👑")
        .setStyle(ButtonStyle.Danger)
    );

    return message.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });
  }
});


// ==========================================
// BUTTONS
// ==========================================

client.on("interactionCreate", async (interaction) => {

  if (!interaction.isButton()) return;


  // ========================================
  // OPEN TICKET
  // ========================================

  if (interaction.customId === "open_ticket") {

    const guild = interaction.guild;

    const existing = guild.channels.cache.find(
      ch => ch.name === `ticket-${interaction.user.id}`
    );

    if (existing) {
      return interaction.reply({
        content: `❌ عندك Ticket مفتوح من قبل: ${existing}`,
        ephemeral: true
      });
    }

    let category = guild.channels.cache.find(
      ch =>
        ch.name === TICKET_CATEGORY &&
        ch.type === ChannelType.GuildCategory
    );

    if (!category) {
      category = await guild.channels.create({
        name: TICKET_CATEGORY,
        type: ChannelType.GuildCategory
      });
    }

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: category.id,

      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [
            PermissionsBitField.Flags.ViewChannel
          ]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        {
          id: guild.members.me.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels
          ]
        }
      ]
    });

    const closeButton = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(closeButton);

    const embed = new EmbedBuilder()
      .setTitle("🎫 Ticket Opened")
      .setDescription(
        `Bienvenue ${interaction.user} !\n\n` +
        `شرح لينا المشكل ديالك هنا، والـStaff غادي يعاونك.\n\n` +
        `🔒 ملي تسالي ضغط على **Close Ticket**.`
      )
      .setColor("Blue");

    await channel.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [row]
    });

    return interaction.reply({
      content: `✅ Ticket créé : ${channel}`,
      ephemeral: true
    });
  }


  // ========================================
  // CLOSE TICKET
  // ========================================

  if (interaction.customId === "close_ticket") {

    await interaction.reply("🔒 Ticket غادي يتسد فـ3 ثواني...");

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 3000);

    return;
  }


  // ========================================
  // ROLES
  // ========================================

  if (interaction.customId.startsWith("role_")) {

    const roleKey = interaction.customId.replace("role_", "");
    const roleName = ROLE_NAMES[roleKey];

    if (!roleName) return;

    const role = interaction.guild.roles.cache.find(
      r => r.name === roleName
    );

    if (!role) {
      return interaction.reply({
        content: `❌ Role **${roleName}** ما لقيتهاش فالسيرفر.`,
        ephemeral: true
      });
    }

    try {

      if (interaction.member.roles.cache.has(role.id)) {

        await interaction.member.roles.remove(role);

        return interaction.reply({
          content: `➖ تحيد ليك role **${roleName}**.`,
          ephemeral: true
        });

      } else {

        await interaction.member.roles.add(role);

        return interaction.reply({
          content: `✅ تزادت ليك role **${roleName}**.`,
          ephemeral: true
        });
      }

    } catch (error) {

      console.error("ROLE ERROR:", error);

      return interaction.reply({
        content: "❌ ماقدرتش نبدل ليك الـRole. تأكد من permissions وترتيب الـRoles.",
        ephemeral: true
      });
    }
  }

});


// ==========================================
// LOGIN
// ==========================================

client.login(process.env.TOKEN);
