import { Events, Collection } from "discord.js";

import { findChannel } from "../modules/findChannel.js";
import { replaceAll } from "../modules/replaceAll.js";
import { JSONManager } from "../modules/JSONManager.js";

const config = new JSONManager("./config.json").get();

// 1분마다 디데이 체크
async function checkDDay(client) {
  // 설정이 한개인지 리스트인지 확인
  let ddays = [];
  if (!(config.dday instanceof Array)) ddays = [config.dday];
  else ddays = config.dday;

  for (const dday of ddays) {
    // 시간, 분 맞는지 확인
    const date = new Date();
    if (date.getHours() == dday.hour && date.getMinutes() == dday.minute) {
      // 디데이 보낼 채널 찾기
      const channel = await findChannel(client, dday.channel);
      if (channel) {
        // 디데이 계산
        const today = new Date();
        const DDay = new Date(dday.startDate);
        const timeGap = today.getTime() - DDay.getTime();
        const result = Math.floor(timeGap / (1000 * 60 * 60 * 24)) + (dday.includeFirstDay ? 1 : 0);

        // 필터링
        const filter = new Collection();
        filter.set("{dday}", String(result));
        filter.set("{everyone}", "@everyone");
        // 메시지 보내고 반응
        if (dday.react) (await channel.send(replaceAll(dday.message, filter))).react(dday.react);
        else await channel.send(replaceAll(dday.message, filter));
      }
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
