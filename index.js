const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AuditLogEvent
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

// ==========================================
// CONFIG
// ==========================================

const WELCOME_CHANNEL_ID = "1533072216550408303";
const LOGS_CHANNEL_ID = "1535451723189981224";
const TICKET_CATEGORY = "tickets";

// ==========================================
// ROLES
// ==========================================

const ROLE_NAMES = {
  creator: "𝐂𝐎𝐍𝐓𝐄𝐍𝐓 𝐂𝐑𝐄𝐀𝐓𝐎𝐑",
  fifa: "𝐅𝐈𝐅𝐀",
  fivem: "𝐅𝐈𝐕𝐄𝐌",
  valorant: "𝐕𝐀𝐋𝐎𝐑𝐀𝐍𝐓",
  minecraft: "𝐌𝐈𝐍𝐄𝐂𝐑𝐀𝐅𝐓",
  freefire: "𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄",
  mta: "𝐌𝐓𝐀 𝐒𝐀𝐍",
  mgbboy: "𝐌𝐆𝐁 𝐁𝐨𝐲",
  mgbqueen: "𝐌𝐆𝐁 𝓠𝓾𝓮𝓮𝓷"
};

// ==========================================
// HELPERS
// ==========================================

async function getLogsChannel(guild) {
  return guild.channels.cache.get(LOGS_CHANNEL_ID);
}

async function sendLog(guild, embed) {
  try {
    const logs = await getLogsChannel(guild);

    if (!logs) {
      console.log("❌ Logs channel not found.");
      return;
    }

    await logs.send({ embeds: [embed] });
  } catch (error) {
    console.error("LOG ERROR:", error);
  }
}

// ==========================================
// READY
// ==========================================

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} is online!`);
  
  const channel = await client.channels.fetch("1533072253736976515");

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("🟢 LMGHARBA Community — Minecraft Server")
    .setDescription(`🇲🇦 **مرحبا بكم فـ LMGHARBA Community!** 🇲🇦

🎮 **Minecraft Server: LmgharbaOneBlock**

💻 **PC / Java:**

> \`LmgharbaOneBlock.aternos.me\`

📱 **Phone / Bedrock:**

> **IP:** \`LmgharbaOneBlock.aternos.me\`
> **Port:** \`19226\`

🔥 **OneBlock • Survival • Community**
👥 دخل لعب مع صحابك وعيشو المغامرة مع LMGHARBA!

⚠️ تأكد من كتابة الـIP والـPort بشكل صحيح.

🇲🇦 **LMGHARBA Community — ديما مجموعين!**`)
    .setColor("Green")
    .setTimestamp();

  await channel.send({
    embeds: [embed]
  });
});

  // Invite cache
  for (const guild of client.guilds.cache.values()) {
    try {
      const invites = await guild.invites.fetch();
      guild.inviteCache = new Map(
        invites.map(invite => [invite.code, invite.uses || 0])
      );
    } catch (error) {
      console.log(`⚠️ Could not fetch invites for ${guild.name}`);
    }
  }
});

// ==========================================
// WELCOME
// ==========================================

client.on("guildMemberAdd", async (member) => {
  try {
    const welcomeChannel = member.guild.channels.cache.get(
      WELCOME_CHANNEL_ID
    );

    // Find inviter
    let inviter = "Unknown";

    try {
      const oldInvites = member.guild.inviteCache || new Map();
      const newInvites = await member.guild.invites.fetch();

      const usedInvite = newInvites.find(invite => {
        const oldUses = oldInvites.get(invite.code) || 0;
        return (invite.uses || 0) > oldUses;
      });

      if (usedInvite && usedInvite.inviter) {
        inviter = `${usedInvite.inviter}`;
      }

      member.guild.inviteCache = new Map(
        newInvites.map(invite => [invite.code, invite.uses || 0])
      );
    } catch (error) {
      console.log("INVITE CHECK ERROR:", error);
    }

    // Welcome message
    if (welcomeChannel) {
      const embed = new EmbedBuilder()
        .setTitle(`👑 Welcome To ${member.guild.name}`)
        .setDescription(
          `## 👋 Welcome ${member}!\n\n` +
          `🎉 **Welcome To Community Lmgharba!**\n\n` +
          `👑 Pls Use Tag **(𝐌𝐆𝐁)**\n\n` +
          `👤 **User:** ${member.user.tag}\n` +
          `🆔 **ID:** ${member.id}\n` +
          `📅 **Joined:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
          `📨 **Invited by:** ${inviter}`
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            extension: "png",
            size: 512
          })
        )
        .setFooter({
          text: "LMGHARBA Community • Welcome"
        })
        .setTimestamp();

      await welcomeChannel.send({
        content: `👑 **Welcome To Community Lmghar Pls Use Tag (𝐌𝐆𝐁) 👑**\nWelcome ${member}!`,
        embeds: [embed]
      });
    }

    // Join log
    const logEmbed = new EmbedBuilder()
      .setTitle("📥 MEMBER JOINED")
      .setDescription(`${member} joined the server.`)
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
        },
        {
          name: "📨 Invited By",
          value: inviter,
          inline: true
        },
        {
          name: "👥 Members",
          value: `${member.guild.memberCount}`,
          inline: true
        }
      )
      .setThumbnail(member.user.displayAvatarURL({ extension: "png" }))
      .setTimestamp();

    await sendLog(member.guild, logEmbed);

  } catch (error) {
    console.error("WELCOME ERROR:", error);
  }
});

// ==========================================
// MEMBER LEAVE
// ==========================================

client.on("guildMemberRemove", async (member) => {
  try {
    const embed = new EmbedBuilder()
      .setTitle("📤 MEMBER LEFT")
      .setDescription(`${member.user.tag} left the server.`)
      .addFields(
        {
          name: "👤 User",
          value: member.user.tag,
          inline: true
        },
        {
          name: "🆔 ID",
          value: member.id,
          inline: true
        }
      )
      .setThumbnail(member.user.displayAvatarURL({ extension: "png" }))
      .setTimestamp();

    await sendLog(member.guild, embed);

  } catch (error) {
    console.error("LEAVE LOG ERROR:", error);
  }
});

// ==========================================
// MESSAGE DELETE LOG
// ==========================================

client.on("messageDelete", async (message) => {
  try {
    if (!message.guild) return;
    if (message.author?.bot) return;

    const content = message.content
      ? message.content.slice(0, 1000)
      : "No text content";

    const embed = new EmbedBuilder()
      .setTitle("🗑️ MESSAGE DELETED")
      .setDescription(
        `A message was deleted in ${message.channel}.`
      )
      .addFields(
        {
          name: "👤 Author",
          value: `${message.author || "Unknown"}`,
          inline: true
        },
        {
          name: "📍 Channel",
          value: `${message.channel}`,
          inline: true
        },
        {
          name: "💬 Content",
          value: content
        }
      )
      .setTimestamp();

    await sendLog(message.guild, embed);

  } catch (error) {
    console.error("MESSAGE DELETE LOG ERROR:", error);
  }
});

// ==========================================
// MESSAGE EDIT LOG
// ==========================================

client.on("messageUpdate", async (oldMessage, newMessage) => {
  try {
    if (!oldMessage.guild) return;
    if (oldMessage.author?.bot) return;

    if (oldMessage.content === newMessage.content) return;

    const oldContent = oldMessage.content || "No content";
    const newContent = newMessage.content || "No content";

    const embed = new EmbedBuilder()
      .setTitle("✏️ MESSAGE EDITED")
      .setDescription(
        `${oldMessage.author || "Unknown"} edited a message in ${oldMessage.channel}.`
      )
      .addFields(
        {
          name: "Before",
          value: oldContent.slice(0, 1000)
        },
        {
          name: "After",
          value: newContent.slice(0, 1000)
        }
      )
      .setTimestamp();

    await sendLog(oldMessage.guild, embed);

  } catch (error) {
    console.error("MESSAGE EDIT LOG ERROR:", error);
  }
});

// ==========================================
// ROLE CREATE
// ==========================================

client.on("roleCreate", async (role) => {
  const embed = new EmbedBuilder()
    .setTitle("🟢 ROLE CREATED")
    .setDescription(`A new role was created.`)
    .addFields(
      {
        name: "👑 Role",
        value: `${role}`,
        inline: true
      },
      {
        name: "🆔 ID",
        value: role.id,
        inline: true
      }
    )
    .setTimestamp();

  await sendLog(role.guild, embed);
});

// ==========================================
// ROLE DELETE
// ==========================================

client.on("roleDelete", async (role) => {
  const embed = new EmbedBuilder()
    .setTitle("🔴 ROLE DELETED")
    .setDescription(`A role was deleted.`)
    .addFields(
      {
        name: "👑 Role",
        value: role.name,
        inline: true
      },
      {
        name: "🆔 ID",
        value: role.id,
        inline: true
      }
    )
    .setTimestamp();

  await sendLog(role.guild, embed);
});

// ==========================================
// CHANNEL CREATE
// ==========================================

client.on("channelCreate", async (channel) => {
  if (!channel.guild) return;

  const embed = new EmbedBuilder()
    .setTitle("🟢 CHANNEL CREATED")
    .setDescription(`A new channel was created.`)
    .addFields(
      {
        name: "📍 Channel",
        value: `${channel}`,
        inline: true
      },
      {
        name: "📂 Type",
        value: `${channel.type}`,
        inline: true
      }
    )
    .setTimestamp();

  await sendLog(channel.guild, embed);
});

// ==========================================
// CHANNEL DELETE
// ==========================================

client.on("channelDelete", async (channel) => {
  if (!channel.guild) return;

  const embed = new EmbedBuilder()
    .setTitle("🔴 CHANNEL DELETED")
    .setDescription(`A channel was deleted.`)
    .addFields({
      name: "📍 Channel",
      value: channel.name
    })
    .setTimestamp();

  await sendLog(channel.guild, embed);
});

// ==========================================
// BAN LOG
// ==========================================

client.on("guildBanAdd", async (ban) => {
  const embed = new EmbedBuilder()
    .setTitle("🔨 MEMBER BANNED")
    .setDescription(`${ban.user.tag} was banned.`)
    .addFields({
      name: "🆔 ID",
      value: ban.user.id
    })
    .setThumbnail(ban.user.displayAvatarURL({ extension: "png" }))
    .setTimestamp();

  await sendLog(ban.guild, embed);
});

// ==========================================
// UNBAN LOG
// ==========================================

client.on("guildBanRemove", async (ban) => {
  const embed = new EmbedBuilder()
    .setTitle("🔓 MEMBER UNBANNED")
    .setDescription(`${ban.user.tag} was unbanned.`)
    .addFields({
      name: "🆔 ID",
      value: ban.user.id
    })
    .setTimestamp();

  await sendLog(ban.guild, embed);
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

    const rules = `
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

⚠️ **Please respect everyone and enjoy the community!**
`;

    const embed = new EmbedBuilder()
      .setTitle("📜 LMGHARBA Community — Rules")
      .setDescription(rules)
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
      .setTitle("🎮 CHOOSE YOUR ROLES")
      .setDescription(
        "اختار الـRole ديالك بالضغط على الزر.\n\n" +
        "🎮 **Games**\n\n" +
        "𝐅𝐈𝐅𝐀\n" +
        "𝐅𝐈𝐕𝐄𝐌\n" +
        "𝐕𝐀𝐋𝐎𝐑𝐀𝐍𝐓\n" +
        "𝐌𝐈𝐍𝐄𝐂𝐑𝐀𝐅𝐓\n" +
        "𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄\n" +
        "𝐌𝐓𝐀 𝐒𝐀𝐍\n\n" +
        "👑 **Community**\n\n" +
        "𝐂𝐎𝐍𝐓𝐄𝐍𝐓 𝐂𝐑𝐄𝐀𝐓𝐎𝐑\n" +
        "𝐌𝐆𝐁 𝐁𝐨𝐲\n" +
        "𝐌𝐆𝐁 𝓠𝓾𝓮𝓮𝓷"
      )
      .setFooter({
        text: "LMGHARBA Community • Role System"
      });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("role_creator")
        .setLabel("𝐂𝐎𝐍𝐓𝐄𝐍𝐓 𝐂𝐑𝐄𝐀𝐓𝐎𝐑")
        .setEmoji("🎥")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_fifa")
        .setLabel("𝐅𝐈𝐅𝐀")
        .setEmoji("⚽")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("role_fivem")
        .setLabel("𝐅𝐈𝐕𝐄𝐌")
        .setEmoji("🚗")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("role_valorant")
        .setLabel("𝐕𝐀𝐋𝐎𝐑𝐀𝐍𝐓")
        .setEmoji("🎯")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("role_minecraft")
        .setLabel("𝐌𝐈𝐍𝐄𝐂𝐑𝐀𝐅𝐓")
        .setEmoji("⛏️")
        .setStyle(ButtonStyle.Success)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("role_freefire")
        .setLabel("𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄")
        .setEmoji("🔥")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("role_mta")
        .setLabel("𝐌𝐓𝐀 𝐒𝐀𝐍")
        .setEmoji("🎮")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_mgbboy")
        .setLabel("𝐌𝐆𝐁 𝐁𝐨𝐲")
        .setEmoji("👦")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("role_mgbqueen")
        .setLabel("𝐌𝐆𝐁 𝓠𝓾𝓮𝓮𝓷")
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
      );

    await channel.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [row]
    });

    const logEmbed = new EmbedBuilder()
      .setTitle("🎫 TICKET OPENED")
      .setDescription(
        `${interaction.user} opened a ticket.`
      )
      .addFields({
        name: "📍 Ticket",
        value: `${channel}`
      })
      .setTimestamp();

    await sendLog(guild, logEmbed);

    return interaction.reply({
      content: `✅ Ticket créé : ${channel}`,
      ephemeral: true
    });
  }

  // ========================================
  // CLOSE TICKET
  // ========================================

  if (interaction.customId === "close_ticket") {

    const channel = interaction.channel;
    const guild = interaction.guild;

    await interaction.reply(
      "🔒 Ticket غادي يتسد فـ3 ثواني..."
    );

    const logEmbed = new EmbedBuilder()
      .setTitle("🔒 TICKET CLOSED")
      .setDescription(
        `Ticket closed by ${interaction.user}.`
      )
      .addFields({
        name: "📍 Channel",
        value: channel.name
      })
      .setTimestamp();

    await sendLog(guild, logEmbed);

    setTimeout(() => {
      channel.delete().catch(() => {});
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

        const embed = new EmbedBuilder()
          .setTitle("➖ ROLE REMOVED")
          .setDescription(
            `${interaction.user} removed **${roleName}**.`
          )
          .setTimestamp();

        await sendLog(interaction.guild, embed);

        return interaction.reply({
          content: `➖ تحيد ليك role **${roleName}**.`,
          ephemeral: true
        });

      } else {

        await interaction.member.roles.add(role);

        const embed = new EmbedBuilder()
          .setTitle("➕ ROLE ADDED")
          .setDescription(
            `${interaction.user} received **${roleName}**.`
          )
          .setTimestamp();

        await sendLog(interaction.guild, embed);

        return interaction.reply({
          content: `✅ تزادت ليك role **${roleName}**.`,
          ephemeral: true
        });
      }

    } catch (error) {

      console.error("ROLE ERROR:", error);

      return interaction.reply({
        content:
          "❌ ماقدرتش نبدل ليك الـRole. تأكد من permissions وترتيب الـRoles.",
        ephemeral: true
      });
    }
  }
});

// ==========================================
// ERROR HANDLING
// ==========================================

client.on("error", error => {
  console.error("DISCORD CLIENT ERROR:", error);
});

process.on("unhandledRejection", error => {
  console.error("UNHANDLED REJECTION:", error);
});

// ==========================================
// LOGIN
// ==========================================

client.login(process.env.TOKEN);
