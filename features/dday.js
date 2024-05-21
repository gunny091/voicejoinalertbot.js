import { Events, Collection } from "discord.js";

import { findChannel } from "../modules/findChannel.js";
import { replaceAll } from "../modules/replaceAll.js";
import { JSONManager } from "../modules/JSONManager.js";

const config = new JSONManager("./config.json").get();

// 1분마다 디데이 체크
async function checkDDay(client) {
  // 시간, 분 맞는지 확인
  const date = new Date();
  if (date.getHours() == config.dday.hour && date.getMinutes() == config.dday.minute) {
    // 디데이 보낼 채널 찾기
    const channel = await findChannel(client, config.dday.channel);
    if (channel) {
      // 디데이 계산
      const today = new Date();
      const DDay = new Date(config.dday.startDate);
      const timeGap = today.getTime() - DDay.getTime();
      const result = Math.floor(timeGap / (1000 * 60 * 60 * 24)) + (config.dday.includeFirstDay ? 1 : 0);

      // 필터링
      const filter = new Collection();
      filter.set("{dday}", String(result));
      filter.set("{everyone}", "@everyone");
      // 메시지 보내고 반응
      if (config.dday.react) (await channel.send(replaceAll(config.dday.message, filter))).react(config.dday.react);
      else await channel.send(replaceAll(config.dday.message, filter));
    }
  }
}
// 1분마다 실행
export default function install(client) {
  client.once(Events.ClientReady, () => {
    if (config.dday) {
      checkDDay(client);
      setInterval(() => checkDDay(client), 60 * 1000);
    }
  });
}
