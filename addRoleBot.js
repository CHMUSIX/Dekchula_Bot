const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const token = 'TOKEN';

const roleId = 'ROLE_ID';

const guildId = 'GUILD_ID';

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error(`ไม่พบเซิร์ฟเวอร์ที่มี ID: ${guildId}`);
    return;
  }

  try {
    await guild.members.fetch();
    const members = guild.members.cache;

    members.forEach(async (member) => {
      if (!member.user.bot) {
        try {
          await member.roles.add(roleId);
          console.log(`เพิ่มยศให้กับสมาชิก ${member.user.tag}`);
        } catch (error) {
          console.error(`เกิดข้อผิดพลาดในการเพิ่มยศให้กับสมาชิก ${member.user.tag}:`, error);
        }
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงสมาชิก:', error);
  }
});

client.login(token);
