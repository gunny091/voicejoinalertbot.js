const fs = require("fs");
const path = require("path");

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

// 설정을 불러오기 위한 JSON Manager
const { JSONManager } = require("./modules/JSONManager");

const config = new JSONManager("./config.json").get();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// 명령어 목록
client.commands = new Collection();

// 기타 변수들 저장하기 위한
client.data = {};

// 명령어 찾기
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    // 명령어 리스트에 추가하기
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  } catch (err) {
    console.error(err);
  }
}

// 상호작용 생성 이벤트
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // 채팅 명령어가 아니면 리턴

  // 명령어 목록 불러오기
  const command = interaction.client.commands.get(interaction.commandName);

  // 명령어가 없을 때
  if (!command) {
    console.error(`${interaction.commandName}라는 명령어가 없음`);
    return;
  }

  try {
    // 명령어 실행
    await command.execute(interaction, client);
  } catch (error) {
    // 오류가 발생했을 때
    console.error(error);
    // 토큰 만료
    if (new Date().getTime() - interaction.createdAt.getTime() > 15 * 60 * 1000) {
      return;
    }
    // 응답 수정
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "명령어 실행 중 오류!",
        ephemeral: true,
      });
    }
    // 오류 응답
    else {
      await interaction.reply({
        content: "명령어 실행 중 오류!",
        ephemeral: true,
      });
    }
  }
});

// 준비 완료
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 기능 적용
const featuresPath = path.join(__dirname, "features");
const featureFiles = fs.readdirSync(featuresPath).filter((file) => file.endsWith(".js"));
for (const file of featureFiles) {
  const filePath = path.join(featuresPath, file);
  try {
    // 적용하기
    const { install } = require(filePath);
    install(client);
  } catch (err) {
    console.error(err);
  }
}

// 로그인
client.login(config.token);
