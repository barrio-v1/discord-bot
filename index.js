const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ChannelType
} = require("discord.js");

const { joinVoiceChannel } = require("@discordjs/voice");

// ==============================
// CONFIG
// ==============================

const TOKEN = process.env.TOKEN;
const PREFIX = "!";

// Channel IDs
const MINECRAFT_CHANNEL_ID = "1533072253736976515";
const VOICE_CHANNEL_ID = "1533072305759060029";

// Channel names
const WELCOME_CHANNEL_NAME = "welcome";
const RULES_CHANNEL_NAME = "rules";
const ROLE_CHANNEL_NAME = "roles";
const TICKET_CHANNEL_NAME = "ticket";
const LOGS_CHANNEL_NAME = "logs";

// Roles
const ROLES = [
    "𝐌𝐆𝐁 𝐁𝐨𝐲",
    "𝐌𝐆𝐁 𝓠𝓾𝓮𝓮𝓷",
    "𝐂𝐎𝐍𝐓𝐄𝐍𝐓 𝐂𝐑𝐄𝐀𝐓𝐎𝐑",
    "𝐅𝐈𝐅𝐀",
    "𝐅𝐈𝐕𝐄𝐌",
    "𝐕𝐀𝐋𝐎𝐑𝐀𝐍𝐓",
    "𝐌𝐈𝐍𝐄𝐂𝐑𝐀𝐅𝐓",
    "𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄",
    "𝐌𝐓𝐀 𝐒𝐀𝐍"
];

// ==============================
// CLIENT
// ==============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// ==============================
// HELPERS
// ==============================

function findChannel(guild, name) {
    return guild.channels.cache.find(
        channel => channel.name === name
    );
}

function findRole(guild, name) {
    return guild.roles.cache.find(
        role => role.name === name
    );
}

function roleIdFromName(name) {
    return `role_${ROLES.indexOf(name)}`;
}

async function sendLog(guild, title, description) {
    try {
        const logs = findChannel(guild, LOGS_CHANNEL_NAME);

        if (!logs || !logs.isTextBased()) {
            console.log(`⚠️ Logs channel not found in ${guild.name}`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        await logs.send({ embeds: [embed] });
    } catch (error) {
        console.log("❌ LOG ERROR:", error);
    }
}

// ==============================
// READY
// ==============================

client.once("ready", async () => {
    console.log(`✅ ${client.user.tag} is online!`);

    try {
        client.user.setActivity("LMGHARBA Community");
    } catch {}

    // VOICE
    try {
        const voiceChannel = await client.channels.fetch(VOICE_CHANNEL_ID);

        if (
            voiceChannel &&
            voiceChannel.type === ChannelType.GuildVoice
        ) {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: true
            });

            console.log(`🎙️ Joined VC: ${voiceChannel.name}`);
        } else {
            console.log("❌ Voice channel not found.");
        }
    } catch (error) {
        console.log("❌ Voice error:", error);
    }

    for (const guild of client.guilds.cache.values()) {
        await sendRules(guild);
        await sendRoles(guild);
        await sendTicketPanel(guild);
    }

    console.log(`🏠 Connected to ${client.guilds.cache.size} server(s).`);
});

// ==============================
// WELCOME
// ==============================

client.on("guildMemberAdd", async member => {
    try {
        const channel = findChannel(
            member.guild,
            WELCOME_CHANNEL_NAME
        );

        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle("👋 Welcome to LMGHARBA Community!")
                .setDescription(
                    `🇲🇦 مرحبا ${member}!

نتمنى ليك وقت زوين معانا ❤️

🎮 **Gaming**
🔥 **Community**
🎫 **Tickets**
🎭 **Choose your roles**
📜 متنساش تقرا القوانين ديال السيرفر.`
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        }

        await sendLog(
            member.guild,
            "📥 Member Joined",
            `${member.user.tag} دخل للسيرفر.`
        );
    } catch (error) {
        console.log("❌ WELCOME ERROR:", error);
    }
});

// ==============================
// MEMBER LEFT
// ==============================

client.on("guildMemberRemove", async member => {
    try {
        await sendLog(
            member.guild,
            "📤 Member Left",
            `${member.user.tag} خرج من السيرفر.`
        );
    } catch (error) {
        console.log("❌ LEAVE ERROR:", error);
    }
});

// ==============================
// RULES
// ==============================

async function sendRules(guild) {
    try {
        const channel = findChannel(
            guild,
            RULES_CHANNEL_NAME
        );

        if (!channel || !channel.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setTitle("📜 LMGHARBA Community - Rules")
            .setDescription(
                `**1. I7tiram faw9 kolchi.**
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
Kol topic 3ando channel dyalo.

**7. 7tarem l'Administration.**
Ila 3andek mochkil, ft7 ticket aw hder m3a staff b i7tiram.

**8. Mamnou3 Inti7al Chakhsiya.**
Matst3melch smiya aw profile dyal chi wa7ed bach tghalat nass.

**9. 7afed 3la Smiya dyal LMGHARBA Community.**
Ay tasarrof kaydir sou2 lcommunity ymken ykoun sabab f lban.

**10. Koun Active w Khlli Jaw Zwin.**
T3awen m3a l'a3da2, stamt3, w b3ed 3la lmachakil.

━━━━━━━━━━━━━━━━━━

⚠️ **Awel Mra:** Warning.
⏳ **Tani Mra:** Mute / Kick.
🚫 **Moukhalafat Kbira:** Temporary Ban aw Permanent Ban.`
            )
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    } catch (error) {
        console.log("❌ RULES ERROR:", error);
    }
}

// ==============================
// ROLES
// ==============================

function makeRoleButton(roleName) {
    return new ButtonBuilder()
        .setCustomId(roleIdFromName(roleName))
        .setLabel(roleName)
        .setStyle(ButtonStyle.Secondary);
}

async function sendRoles(guild) {
    try {
        const channel = findChannel(
            guild,
            ROLE_CHANNEL_NAME
        );

        if (!channel || !channel.isTextBased()) return;

        const rows = [];

        for (let i = 0; i < ROLES.length; i += 5) {
            const row = new ActionRowBuilder().addComponents(
                ROLES
                    .slice(i, i + 5)
                    .map(makeRoleButton)
            );

            rows.push(row);
        }

        const embed = new EmbedBuilder()
            .setTitle("🎭 Choose Your Roles")
            .setDescription(
                `اختار الـRole ديالك بالضغط على الزر 👇

🎮 **Games**
MTA SAN • FREE FIRE • MINECRAFT • VALORANT
FIVEM • FIFA

👑 **Community**
CONTENT CREATOR • MGB BOY • MGB QUEEN`
            )
            .setTimestamp();

        await channel.send({
            embeds: [embed],
            components: rows
        });

        console.log(`🎭 Roles panel sent in ${guild.name}`);
    } catch (error) {
        console.log("❌ ROLE PANEL ERROR:", error);
    }
}

// ==============================
// TICKET
// ==============================

async function sendTicketPanel(guild) {
    try {
        const channel = findChannel(
            guild,
            TICKET_CHANNEL_NAME
        );

        if (!channel || !channel.isTextBased()) return;

        const button = new ButtonBuilder()
            .setCustomId("create_ticket")
            .setLabel("Create Ticket")
            .setEmoji("🎫")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        const embed = new EmbedBuilder()
            .setTitle("🎫 LMGHARBA Support")
            .setDescription(
                `عندك مشكل أو بغيتي تتواصل مع Staff؟

ضغط على **🎫 Create Ticket** وفتح Ticket خاص بيك.`
            );

        await channel.send({
            embeds: [embed],
            components: [row]
        });
    } catch (error) {
        console.log("❌ TICKET PANEL ERROR:", error);
    }
}

// ==============================
// INTERACTIONS
// ==============================

client.on("interactionCreate", async interaction => {
    try {

        // ROLE BUTTON
        if (
            interaction.isButton() &&
            interaction.customId.startsWith("role_")
        ) {
            const roleIndex = Number(
                interaction.customId.replace("role_", "")
            );

            const roleName = ROLES[roleIndex];

            if (!roleName) {
                return interaction.reply({
                    content: "❌ هاد الـRole ما بقاتش موجودة.",
                    ephemeral: true
                });
            }

            await interaction.deferReply({
                ephemeral: true
            });

            const role = findRole(
                interaction.guild,
                roleName
            );

            if (!role) {
                return interaction.editReply({
                    content:
                        `❌ ما لقيتش Role: **${roleName}**`
                });
            }

            const botMember = interaction.guild.members.me;

            if (!botMember) {
                return interaction.editReply({
                    content:
                        "❌ ما قدرتش نلقى Member ديال البوت."
                });
            }

            if (
                role.managed ||
                role.position >= botMember.roles.highest.position
            ) {
                return interaction.editReply({
                    content:
                        `❌ ما نقدرش نعطيك **${roleName}**.\n` +
                        `خاص رتبة البوت تكون فوق هاد الـRole.`
                });
            }

            if (
                interaction.member.roles.cache.has(role.id)
            ) {
                await interaction.member.roles.remove(role);

                await sendLog(
                    interaction.guild,
                    "🎭 Role Removed",
                    `${interaction.user.tag} → ${roleName}`
                );

                return interaction.editReply({
                    content:
                        `❌ تحيدات ليك **${roleName}**`
                });
            }

            await interaction.member.roles.add(role);

            await sendLog(
                interaction.guild,
                "🎭 Role Added",
                `${interaction.user.tag} → ${roleName}`
            );

            return interaction.editReply({
                content:
                    `✅ تزادت ليك **${roleName}**`
            });
        }

        // CREATE TICKET
        if (
            interaction.isButton() &&
            interaction.customId === "create_ticket"
        ) {
            await interaction.deferReply({
                ephemeral: true
            });

            const guild = interaction.guild;

            const existing = guild.channels.cache.find(
                channel =>
                    channel.name ===
                    `ticket-${interaction.user.id}`
            );

            if (existing) {
                return interaction.editReply({
                    content:
                        `🎫 عندك Ticket مفتوح: ${existing}`
                });
            }

            const ticket = await guild.channels.create({
                name: `ticket-${interaction.user.id}`,
                type: ChannelType.GuildText,
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

            await ticket.send({
                content: `${interaction.user}`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle("🎫 Ticket")
                        .setDescription(
                            "مرحبا 👋 شرح لينا المشكل ديالك هنا."
                        )
                ],
                components: [row]
            });

            await sendLog(
                guild,
                "🎫 Ticket Created",
                `${interaction.user.tag} فتح Ticket: ${ticket.name}`
            );

            return interaction.editReply({
                content:
                    `✅ Ticket تفتح: ${ticket}`
            });
        }

        // CLOSE TICKET
        if (
            interaction.isButton() &&
            interaction.customId === "close_ticket"
        ) {
            if (
                !interaction.member.permissions.has(
                    PermissionsBitField.Flags.ManageChannels
                )
            ) {
                return interaction.reply({
                    content:
                        "❌ غير Staff يقدر يسد Ticket.",
                    ephemeral: true
                });
            }

            await interaction.reply(
                "🔒 Ticket غادي يتسد..."
            );

            await sendLog(
                interaction.guild,
                "🔒 Ticket Closed",
                `${interaction.user.tag} سد Ticket.`
            );

            setTimeout(() => {
                interaction.channel
                    .delete()
                    .catch(() => {});
            }, 3000);
        }

    } catch (error) {
        console.log("❌ INTERACTION ERROR:", error);

        try {
            if (interaction.deferred) {
                await interaction.editReply({
                    content:
                        "❌ وقع مشكل فتنفيذ العملية."
                });
            } else if (!interaction.replied) {
                await interaction.reply({
                    content:
                        "❌ وقع مشكل فتنفيذ العملية.",
                    ephemeral: true
                });
            }
        } catch {}
    }
});

// ==============================
// COMMANDS
// ==============================

client.on("messageCreate", async message => {
    try {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

        const command = args.shift()?.toLowerCase();

        // !ping
        if (command === "ping") {
            return message.reply("🏓 Pong !");
        }

        // !minecraft
        if (command === "minecraft") {
            const embed = new EmbedBuilder()
                .setTitle(
                    "🟢 LMGHARBA Community — Minecraft Server"
                )
                .setDescription(
                    `🇲🇦 **مرحبا بكم فـ LMGHARBA Community!** 🇲🇦

🎮 **Minecraft Server: LmgharbaOneBlock**

🔥 **OneBlock • Survival • Community**

👥 دخل لعب مع صحابك وعيشو المغامرة مع LMGHARBA!

🇲🇦 **LMGHARBA Community — ديما مجموعين!**`
                )
                .setTimestamp();

            return message.channel.send({
                embeds: [embed]
            });
        }

    } catch (error) {
        console.log("❌ COMMAND ERROR:", error);
    }
});

// ==============================
// ERRORS
// ==============================

client.on("error", error => {
    console.log("❌ Discord Error:", error);
});

process.on("unhandledRejection", error => {
    console.log("❌ Unhandled Rejection:", error);
});

// ==============================
// LOGIN
// ==============================

if (!TOKEN) {
    console.log(
        "❌ TOKEN ما لقاهاش فـGitHub Secrets."
    );
    process.exit(1);
}

client.login(TOKEN);
