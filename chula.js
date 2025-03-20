const { Client, GatewayIntentBits, ActivityType, version: djsVersion, Partials, EmbedBuilder, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();
const config = require('./config.js');
const os = require('os');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

///////////////////////////////////////////////////////////////////////////////////////////////////
const statusTypes = ["dnd", "idle", "streaming"];
let statusIndex = 0;
let guild;

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);
  await registerCommands();
  guild = client.guilds.cache.get(process.env.guildID);
  if (!guild) {
    console.log("❌ ไม่พบเซิร์ฟเวอร์!");
    return;
  }

  updateStatus();
  setInterval(updateStatus, 5000);
});

async function updateStatus() {
  if (!guild) return console.log("⚠️ ยังไม่ได้กำหนดค่า guild");

  await guild.members.fetch();
  const memberCount = guild.memberCount;

  const statuses = [
    { text: `🌍 ออนไลน์อยู่ | สมาชิก: ${memberCount} คน`, type: ActivityType.Watching },
    { text: `🕒 ออนมาแล้ว: ${Math.floor(process.uptime() / 60)} นาที`, type: ActivityType.Watching },
    { text: `💬 ใช้ /help เพื่อดูคำสั่งทั้งหมด`, type: ActivityType.Listening },
    { text: `🎮 กำลังเล่นกับ ${memberCount} คน`, type: ActivityType.Playing },
    { text: `🚀 พัฒนาโดย SAMYAN 109`, type: ActivityType.Watching },
    { text: `🎥 สตรีมอยู่บน Twitch!`, type: ActivityType.Streaming, url: "https://www.twitch.tv/nonyread" },
    { text: `🔔 ติดตามข่าวสารใหม่ๆ ได้ที่เซิร์ฟเวอร์!`, type: ActivityType.Watching },
    { text: `🤖 พร้อมให้บริการแล้ว!`, type: ActivityType.Competing },
    { text: `📢 ประกาศล่าสุด`, type: ActivityType.Listening },
    { text: `📌 อย่าลืมอ่านกฎที่ rules`, type: ActivityType.Watching },
    { text: `🛠️ กำลังอัปเดตฟีเจอร์ใหม่...`, type: ActivityType.Playing }
  ];

  const status = statuses[statusIndex];

  client.user.setPresence({
    activities: [{ name: status.text, type: status.type, url: status.url || undefined }],
    status: status.text.includes("สตรีม") ? "streaming" : statusTypes[statusIndex % statusTypes.length]
  });

  statusIndex = (statusIndex + 1) % statuses.length;
}
///////////////////////////////////////////////////////////////////////////////////////////////////

async function registerCommands() {
  const commands = [
    {
      name: 'role',
      description: 'เปิดเมนูการจัดการยศของคุณ',
      options: []
    },
    {
      name: 'setup',
      description: 'ตั้งค่าระบบยศ (เฉพาะแอดมิน)',
      options: []
    },
    {
      name: 'help',
      description: 'ดูคำสั่งทั้งหมดของบอท',
      options: []
    },
    {
      name: 'botinfo',
      description: 'แสดงข้อมูลของบอท',
      options: []
    },
    {
      name: 'ping',
      description: 'ทดสอบการเชื่อมต่อของบอท',
      options: []
    }
  ];

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'role') {
    await handleRoleCommand(interaction);
  }
  else if (commandName === 'setup') {
    await handleSetupCommand(interaction);
  }
  else if (commandName === 'help') {
    await handleHelpCommand(interaction);
  }
  else if (commandName === 'ping') {
    await interaction.reply({ content: `🏓 Pong! Latency: ${client.ws.ping}ms`, ephemeral: true });
  }
  else if (commandName === "botinfo") {
    const platform = os.platform();
    const cpu = os.cpus()[0].model;
    const uptime = os.uptime();
    const botUptime = process.uptime();
    const totalMem = os.totalmem() / 1024 / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024 / 1024;
    const usedMem = totalMem - freeMem;
    const cpuUsage = (process.cpuUsage().user / 1000000).toFixed(2);
    const nodeVersion = process.version;
    const serverCount = client.guilds.cache.size;
    const userCount = client.users.cache.size;

    function formatTime(seconds) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
    }

    const embed = new EmbedBuilder()
      .setColor("#ff6600")
      .setTitle("🤖 **Bot Information**")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription("💡 **ข้อมูลเกี่ยวกับบอทที่คุณใช้งาน**")
      .addFields(
        { name: "📌 ชื่อบอท", value: `\`${client.user.username}\``, inline: true },
        { name: "💻 ระบบที่รัน", value: `\`${platform}\``, inline: true },
        { name: "⚙️ CPU", value: `\`${cpu}\``, inline: false },
        { name: "📊 RAM ใช้ไป", value: `\`${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB\``, inline: true },
        { name: "🟢 RAM ที่เหลือ", value: `\`${freeMem.toFixed(2)} GB\``, inline: true },
        { name: "⏳ เครื่องทำงานมาแล้ว", value: `\`${formatTime(uptime)}\``, inline: false },
        { name: "🕒 บอทรันมาแล้ว", value: `\`${formatTime(botUptime)}\``, inline: false },
        { name: "🖥️ Node.js เวอร์ชัน", value: `\`${nodeVersion}\``, inline: true },
        { name: "📜 Discord.js เวอร์ชัน", value: `\`${djsVersion}\``, inline: true },
        { name: "🌍 จำนวนเซิร์ฟเวอร์", value: `\`${serverCount} เซิร์ฟเวอร์\``, inline: true },
        { name: "👥 จำนวนผู้ใช้", value: `\`${userCount} คน\``, inline: true },
        { name: "🔥 CPU Usage", value: `\`${cpuUsage}%\``, inline: true },
        { name: "👨‍💻 ผู้พัฒนา", value: `\`SAMYAN 109\``, inline: true }
      )
      .setImage("https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif?cid=790b76118t1t5lpb5f35t6n1l4hk0uq7aj5wfaqydmcoko6q&ep=v1_gifs_search&rid=giphy.gif&ct=g")
      .setFooter({ text: `บอทพัฒนาโดย SAMYAN 109`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
});


async function handleRoleCommand(interaction) {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('decorative_roles')
        .setLabel('🎭 ยศตกแต่ง')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('sex_roles')
        .setLabel('🎮 ยศเพศ')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('game_roles')
        .setLabel('🎮 ยศเกม')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('color_roles')
        .setLabel('🎨 ยศสี')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('notification_roles')
        .setLabel('🔔 ยศแจ้งเตือน')
        .setStyle(ButtonStyle.Secondary)
    );

  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('🌟 ระบบจัดการยศ')
    .setDescription('เลือกประเภทยศที่คุณต้องการจัดการโดยคลิกที่ปุ่มด้านล่าง')
    .setImage('https://media1.tenor.com/m/MhsdqUU_djAAAAAC/aesthetic-wallpaper-anime.gif')
    .setFooter({ text: 'ระบบยศอัตโนมัติ', iconURL: interaction.guild.iconURL() });

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}


async function handleSetupCommand(interaction) {

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({ content: '❌ คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
  }

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('setup_welcome')
        .setLabel('🎉 ตั้งค่าระบบต้อนรับ')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('setup_roles')
        .setLabel('🎭 ตั้งค่าเมนูยศสาธารณะ')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('setup_channels')
        .setLabel('📂 ตั้งค่าห้องตามยศ')
        .setStyle(ButtonStyle.Secondary)
    );

  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('⚙️ ระบบตั้งค่า')
    .setDescription('เลือกสิ่งที่คุณต้องการตั้งค่าโดยคลิกที่ปุ่มด้านล่าง')
    .setFooter({ text: 'ระบบตั้งค่าสำหรับแอดมิน', iconURL: interaction.guild.iconURL() });

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}


async function handleHelpCommand(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('📚 คำสั่งทั้งหมด')
    .setDescription('รายการคำสั่งทั้งหมดที่สามารถใช้งานได้')
    .addFields(
      { name: '/role', value: 'เปิดเมนูการจัดการยศของคุณ' },
      { name: '/setup', value: 'ตั้งค่าระบบยศ (เฉพาะแอดมิน)' },
      { name: '/help', value: 'ดูคำสั่งทั้งหมดของบอท' },
      { name: '/ping', value: 'ทดสอบการเชื่อมต่อของบอท' }
    )
    .setFooter({ text: 'ระบบช่วยเหลือ', iconURL: interaction.guild.iconURL() });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}


client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;


  if (customId === 'decorative_roles') {
    await showDecorativeRoles(interaction);
  }
  else if (customId === 'sex_roles') {
    await showSexRoles(interaction);
  }
  else if (customId === 'game_roles') {
    await showGameRoles(interaction);
  }
  else if (customId === 'color_roles') {
    await showColorRoles(interaction);
  }
  else if (customId === 'notification_roles') {
    await showNotificationRoles(interaction);
  }


  else if (customId === 'setup_welcome') {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: '❌ คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
    }
    await setupWelcomeChannel(interaction);
  }
  else if (customId === 'setup_roles') {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: '❌ คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
    }
    await setupPublicRoleMenu(interaction);
  }
  else if (customId === 'setup_channels') {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: '❌ คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
    }
    await setupRoleChannels(interaction);
  }
});


async function showDecorativeRoles(interaction) {
  const options = config.decorativeRoles.map(role => ({
    label: `🎭 ${role.name}`,
    value: role.value,
    description: role.description,
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_decorative_role')
      .setPlaceholder('เลือกยศตกแต่งของคุณ')
      .setMinValues(0)
      .setMaxValues(5)
      .addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('🎭 **ยศตกแต่ง**')
    .setDescription('— ✨ เลือกยศตกแต่งที่คุณต้องการ (เลือกได้ 1 ยศ) ✨ —')
    .setThumbnail('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2JyaDhnODRrNjc0djFxeWR5NmdiNDE0d2IyZmE4bXdhYmh0Zzk2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yASFCj2K0MGeASqSom/giphy.gif')
    .setImage('https://media1.tenor.com/m/MhsdqUU_djAAAAAC/aesthetic-wallpaper-anime.gif')
    .setFooter({ text: '🔸 ยศตกแต่งไม่มีผลต่อการเข้าถึงห้อง 🔸', iconURL: interaction.guild.iconURL() });

  await interaction.deferReply();
  await interaction.editReply({ embeds: [embed], components: [row] });
}
////////////////////////////////////////////////////////////////
async function showSexRoles(interaction) {
  const options = config.sexRoles.map(role => ({
    label: `🎮 ${role.name}`,
    value: role.value,
    description: role.description,
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_sex_role')
      .setPlaceholder('👧🏻 เลือกยศเพศของคุณ')
      .setMinValues(0)
      .setMaxValues(1)
      .setMaxValues(config.sexRoles.length)
      .addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor('#33cc33')
    .setTitle('👧🏻 **ยศเพศ**')
    .setDescription('— 👧🏻 เลือกเพศของคุณ 👧🏻 —\n🟢 การเลือกยศเพศจะไม่มีผลในดิสคอร์ส')
    .setThumbnail('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2JyaDhnODRrNjc0djFxeWR5NmdiNDE0d2IyZmE4bXdhYmh0Zzk2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yASFCj2K0MGeASqSom/giphy.gif')
    .setImage('https://media1.tenor.com/m/MhsdqUU_djAAAAAC/aesthetic-wallpaper-anime.gif')
    .setFooter({ text: '🎮 ยศเกมช่วยให้คุณเข้าถึงห้องพิเศษ 🎮', iconURL: interaction.guild.iconURL() });

  await interaction.deferReply();
  await interaction.editReply({ embeds: [embed], components: [row] });
}
////////////////////////////////////////////////////////////////
async function showGameRoles(interaction) {
  const options = config.gameRoles.map(role => ({
    label: `🎮 ${role.name}`,
    value: role.value,
    description: role.description,
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_game_role')
      .setPlaceholder('🎮 เลือกยศเกมของคุณ')
      .setMinValues(0)
      .setMaxValues(5)
      .setMaxValues(config.gameRoles.length)
      .addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor('#33cc33')
    .setTitle('🎮 **ยศเกม**')
    .setDescription('— 🕹️ เลือกยศเกมที่คุณสนใจ (สามารถเลือกได้หลายยศ) 🕹️ —\n🟢 การเลือกยศเกมจะทำให้คุณสามารถเข้าถึงห้องพูดคุยเฉพาะเกมนั้นๆ')
    .setThumbnail('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2JyaDhnODRrNjc0djFxeWR5NmdiNDE0d2IyZmE4bXdhYmh0Zzk2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yASFCj2K0MGeASqSom/giphy.gif')
    .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExam1jcGp6ZGlsbDJueDEyanYzMjZuM2p4a2lpdGxsamFrMTZpbDEwbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/y0NFayaBeiWEU/giphy.gif')
    .setFooter({ text: '🎮 ยศเกมช่วยให้คุณเข้าถึงห้องพิเศษ 🎮', iconURL: interaction.guild.iconURL() });

  await interaction.deferReply();
  await interaction.editReply({ embeds: [embed], components: [row] });
}

async function showColorRoles(interaction) {
  const options = config.colorRoles.map(role => ({
    label: `🎨 ${role.name}`,
    value: role.value,
    description: role.description,
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_color_role')
      .setPlaceholder('🌈 เลือกยศสีของคุณ')
      .setMinValues(0)
      .setMaxValues(1)
      .addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor('#ff3333')
    .setTitle('🎨 **ยศสี**')
    .setDescription('— 🌈 เลือกสีชื่อที่คุณต้องการ (เลือกได้ 1 สี) 🌈 —')
    .setThumbnail('https://cdn.discordapp.com/emojis/1065001930634897428.gif?size=96')
    .setImage('https://media1.tenor.com/m/MhsdqUU_djAAAAAC/aesthetic-wallpaper-anime.gif')
    .setFooter({ text: '🎨 สีจะถูกแสดงในชื่อของคุณ 🎨', iconURL: interaction.guild.iconURL() });

  await interaction.deferReply();
  await interaction.editReply({ embeds: [embed], components: [row] });
}

async function handleRoleSelection(interaction) {
  try {

    if (!interaction.isSelectMenu()) return;


    await interaction.deferReply({ ephemeral: true });

    const member = interaction.member;
    const selectedRoles = interaction.values;

    for (const roleId of selectedRoles) {
      let role = interaction.guild.roles.cache.get(roleId);
      if (!role) continue;


      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
      } else {
        await member.roles.add(role);
      }
    }


    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        content: `✅ คุณได้รับยศ: ${selectedRoles.map(id => `<@&${id}>`).join(', ')}! 🎉`,
      });
    }
  } catch (error) {
    console.error('❌ Error handling role selection:', error);
  }
}


async function showNotificationRoles(interaction) {
  const options = config.notificationRoles.map(role => ({
    label: role.name,
    value: role.value,
    description: role.description,
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_notification_role')
      .setPlaceholder('เลือกยศแจ้งเตือนของคุณ')
      .setMinValues(0)
      .setMaxValues(1)
      .addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('🔔 ยศแจ้งเตือน')
    .setDescription('เลือกยศแจ้งเตือนที่คุณต้องการ (สามารถเลือกได้ 1 ยศ)')
    .setImage('https://i.pinimg.com/originals/2f/bc/21/2fbc21830cfdc2e1178081000f4e8d06.gif')
    .setFooter({ text: 'ระบบยศอัตโนมัติ', iconURL: interaction.guild.iconURL() });

  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({ embeds: [embed], components: [row] });
}


async function setupPublicRoleMenu(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('🎭 ตั้งค่าเมนูยศสาธารณะ')
    .setDescription('คุณสามารถสร้างเมนูยศสาธารณะให้สมาชิกเลือกยศที่ต้องการได้')
    .setImage('https://i.pinimg.com/originals/2f/bc/21/2fbc21830cfdc2e1178081000f4e8d06.gif')
    .setFooter({ text: 'ตั้งค่าเมนูยศสาธารณะ', iconURL: interaction.guild.iconURL() });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('create_decorative_menu')
        .setLabel('🎭 สร้างเมนูยศตกแต่ง')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('create_decorative_menu')
        .setLabel('🧑🏻 สร้างเมนูยศเพศ')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('create_game_menu')
        .setLabel('🎮 สร้างเมนูยศเกม')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('create_color_menu')
        .setLabel('🎨 สร้างเมนูยศสี')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('create_notification_menu')
        .setLabel('🔔 สร้างเมนูยศแจ้งเตือน')
        .setStyle(ButtonStyle.Secondary)
    );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}


async function setupRoleChannels(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('📂 ตั้งค่าห้องตามยศ')
    .setDescription('คุณสามารถตั้งค่าให้สมาชิกที่มียศเฉพาะสามารถเข้าถึงห้องพิเศษได้')
    .setImage('https://media1.tenor.com/m/MhsdqUU_djAAAAAC/aesthetic-wallpaper-anime.gif')
    .setFooter({ text: 'ตั้งค่าห้องตามยศ', iconURL: interaction.guild.iconURL() });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('setup_game_channels')
        .setLabel('🎮 ตั้งค่าห้องเกม')
        .setStyle(ButtonStyle.Primary)
    );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  const { customId, values, member } = interaction;


  if (customId === 'select_decorative_role') {

    for (const role of config.decorativeRoles) {
      const guildRole = interaction.guild.roles.cache.find(r => r.name === role.name);
      if (guildRole && member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
      }
    }


    if (values.length > 0) {
      const value = values[0];
      const roleConfig = config.decorativeRoles.find(r => r.value === value);


      let guildRole = interaction.guild.roles.cache.find(r => r.name === roleConfig.name);

      if (!guildRole) {

        try {
          guildRole = await interaction.guild.roles.create({
            name: roleConfig ? roleConfig.name : `${value}`,
            color: roleConfig ? roleConfig.color : '#ff9900',
            reason: 'Automatic role creation by role bot'
          });
        } catch (error) {
          console.error('Error creating role:', error);
          return interaction.reply({ content: '❌ เกิดข้อผิดพลาดในการสร้างยศ กรุณาแจ้งแอดมิน', ephemeral: true });
        }
      }


      await member.roles.add(guildRole);

      const roleName = roleConfig ? roleConfig.name : value;
      await interaction.reply({ content: `✅ คุณได้รับยศตกแต่ง: ${roleName} แล้ว!`, ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ คุณได้ลบยศตกแต่งทั้งหมดแล้ว', ephemeral: true });
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (customId === 'select_sex_role') {

    for (const role of config.sexRoles) {
      const guildRole = interaction.guild.roles.cache.find(r => r.name === role.name);
      if (guildRole && member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
      }
    }


    if (values.length > 0) {
      const value = values[0];
      const roleConfig = config.sexRoles.find(r => r.value === value);


      let guildRole = interaction.guild.roles.cache.find(r => r.name === roleConfig.name);

      if (!guildRole) {

        try {
          guildRole = await interaction.guild.roles.create({
            name: roleConfig ? roleConfig.name : `${value}`,
            color: roleConfig ? roleConfig.color : '#ff3333',
            reason: 'Automatic role creation by role bot'
          });
        } catch (error) {
          console.error('Error creating role:', error);
          return interaction.reply({ content: '❌ เกิดข้อผิดพลาดในการสร้างยศ กรุณาแจ้งแอดมิน', ephemeral: true });
        }
      }


      await member.roles.add(guildRole);

      const roleName = roleConfig ? roleConfig.name : value;
      await interaction.reply({ content: `✅ คุณได้รับยศสี: ${roleName} แล้ว!`, ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ คุณได้ลบยศสีทั้งหมดแล้ว', ephemeral: true });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  else if (customId === 'select_game_role') {

    for (const role of config.gameRoles) {
      const guildRole = interaction.guild.roles.cache.find(r => r.name === role.name);
      if (guildRole && member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
      }
    }


    const selectedRoles = [];

    for (const value of values) {
      const roleConfig = config.gameRoles.find(r => r.value === value);


      let guildRole = interaction.guild.roles.cache.find(r => r.name === roleConfig.name);

      if (!guildRole) {

        try {
          guildRole = await interaction.guild.roles.create({
            name: roleConfig ? roleConfig.name : `${value}`,
            color: roleConfig ? roleConfig.color : '#33cc33',
            reason: 'Automatic role creation by role bot'
          });
        } catch (error) {
          console.error('Error creating role:', error);
          continue;
        }
      }


      await member.roles.add(guildRole);
      selectedRoles.push(roleConfig ? roleConfig.name : value);


      if (roleConfig && roleConfig.channelId) {
        const channel = interaction.guild.channels.cache.get(roleConfig.channelId);
        if (channel) {
          try {
            await channel.permissionOverwrites.create(member, {
              ViewChannel: true
            });
          } catch (error) {
            console.error(`Error setting channel permissions for ${channel.name}:`, error);
          }
        }
      }
    }

    if (selectedRoles.length > 0) {
      await interaction.reply({
        content: `✅ คุณได้รับยศเกม: ${selectedRoles.join(', ')} แล้ว!`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ คุณได้ลบยศเกมทั้งหมดแล้ว',
        ephemeral: true
      });
    }
  }


  else if (customId === 'select_color_role') {

    for (const role of config.colorRoles) {
      const guildRole = interaction.guild.roles.cache.find(r => r.name === role.name);
      if (guildRole && member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
      }
    }


    if (values.length > 0) {
      const value = values[0];
      const roleConfig = config.colorRoles.find(r => r.value === value);


      let guildRole = interaction.guild.roles.cache.find(r => r.name === roleConfig.name);

      if (!guildRole) {

        try {
          guildRole = await interaction.guild.roles.create({
            name: roleConfig ? roleConfig.name : `${value}`,
            color: roleConfig ? roleConfig.color : '#ff3333',
            reason: 'Automatic role creation by role bot'
          });
        } catch (error) {
          console.error('Error creating role:', error);
          return interaction.reply({ content: '❌ เกิดข้อผิดพลาดในการสร้างยศ กรุณาแจ้งแอดมิน', ephemeral: true });
        }
      }


      await member.roles.add(guildRole);

      const roleName = roleConfig ? roleConfig.name : value;
      await interaction.reply({ content: `✅ คุณได้รับยศสี: ${roleName} แล้ว!`, ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ คุณได้ลบยศสีทั้งหมดแล้ว', ephemeral: true });
    }
  }


  else if (customId === 'select_notification_role') {

    for (const role of config.notificationRoles) {
      const guildRole = interaction.guild.roles.cache.find(r => r.name === role.name);
      if (guildRole && member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
      }
    }


    const selectedRoles = [];

    for (const value of values) {
      const roleConfig = config.notificationRoles.find(r => r.value === value);


      let guildRole = interaction.guild.roles.cache.find(r => r.name === roleConfig.name);

      if (!guildRole) {

        try {
          guildRole = await interaction.guild.roles.create({
            name: roleConfig ? roleConfig.name : `${value}`,
            color: roleConfig ? roleConfig.color : '#9999ff',
            reason: 'Automatic role creation by role bot'
          });
        } catch (error) {
          console.error('Error creating role:', error);
          continue;
        }
      }


      await member.roles.add(guildRole);
      selectedRoles.push(roleConfig ? roleConfig.name : value);
    }

    if (selectedRoles.length > 0) {
      await interaction.reply({
        content: `✅ คุณได้รับยศแจ้งเตือน: ${selectedRoles.join(', ')} แล้ว!`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ คุณได้ลบยศแจ้งเตือนทั้งหมดแล้ว',
        ephemeral: true
      });
    }
  }
});

client.on('guildMemberAdd', async member => {
  try {
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === config.welcomeChannelName);
    if (!welcomeChannel) return;

    const welcomeGif = 'https://media.giphy.com/media/xUPGcEliCc7bETyfO8/giphy.gif';
    const username = `\`${member.user.username}\``;

    const buttons = new ActionRowBuilder();
    if (config.rulesLink) {
      buttons.addComponents(
        new ButtonBuilder()
          .setLabel('📜 อ่านกฎของเซิร์ฟเวอร์')
          .setURL(config.rulesLink)
          .setStyle(ButtonStyle.Link)
      );
    }
    if (config.introLink) {
      buttons.addComponents(
        new ButtonBuilder()
          .setLabel('🎉 เข้าร่วมแชทเลย!')
          .setURL(config.introLink)
          .setStyle(ButtonStyle.Link)
      );
    }

    const embed = new EmbedBuilder()
      .setColor('#FFB6C1')
      .setTitle(`✨ ยินดีต้อนรับ ${username}! ✨`)
      .setDescription(`
🎊 **${username} ได้เข้าร่วมเซิร์ฟเวอร์ของเราแล้ว!**  
> 🏠 **เซิร์ฟเวอร์ของเรา:** \`${member.guild.name}\`  
> 📅 **เข้าร่วมเมื่อ:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>

🎈 **กดปุ่มด้านล่างเพื่อเริ่มต้นการผจญภัยของคุณ! 🚀**
            `)
      .setImage(welcomeGif)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: '💚 ระบบต้อนรับอัตโนมัติ', iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    if (buttons.components.length > 0) {
      await welcomeChannel.send({ embeds: [embed], components: [buttons] });
    } else {
      await welcomeChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในระบบต้อนรับ:", error);
  }
});

client.on('guildMemberRemove', async member => {
  try {
    const goodbyeChannel = member.guild.channels.cache.find(ch => ch.name === config.goodbyeChannelName);
    if (!goodbyeChannel) return;

    const goodbyeGif = 'https://media.giphy.com/media/vxNCVEe0PI9A3YVJEX/giphy.gif?cid=790b7611q6meakpa0oxbl22junxj8rdouoat6ezkr8df8jfn&ep=v1_gifs_search&rid=giphy.gif&ct=g';
    const username = `\`${member.user.username}\``;

    const timeInServer = moment.duration(member.joinedTimestamp - Date.now()).humanize(true);

    const embed = new EmbedBuilder()
      .setColor('#FF6347')
      .setTitle(`💔 อำลา ${username} 💔`)
      .setDescription(`
😭 **${username} ได้ออกจากเซิร์ฟเวอร์แล้ว...**  
> 🏠 **เซิร์ฟเวอร์:** \`${member.guild.name}\`  
> ⏳ **อยู่ในเซิร์ฟเวอร์เป็นเวลา:** \`${timeInServer}\`

💖 **ขอให้โชคดีและหวังว่าจะได้พบกันอีกในอนาคต!**  
            `)
      .setImage(goodbyeGif)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: '👋 ระบบอำลาอัตโนมัติ', iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await goodbyeChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในระบบอำลา:", error);
  }
});

client.login(config.token);