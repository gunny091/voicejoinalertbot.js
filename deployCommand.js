const fs = require("fs");
const path = require("path");

const { REST, Routes } = require("discord.js");

const { JSONManager } = require("./modules/JSONManager.js");

const { token, clientId } = new JSONManager("./config.json").get();

(async () => {
  // 명령어 찾기
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  // 명령어 목록에 추가
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require("file:///" + filePath);
      commands.push(command.data.toJSON());
    } catch (err) {
      console.error(err);
    }
  }

  // 명령어 적용
  const rest = new REST().setToken(token);
  try {
    console.log(`${commands.length}개의 명령어 적용 중...`);

    // 업로드
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`${data.length}개의 명령어 적용 완료!`);
  } catch (error) {
    // 오류처리
    console.error(error);
  }
})();
