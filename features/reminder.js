import { Collection, Events } from "discord.js";
import { findChannel } from "../modules/findChannel.js";
import { JSONManager } from "../modules/JSONManager.js";

const reminderJSON = new JSONManager("./reminder.json");

function check(client) {
  // 리마인더 중 날짜 지난거 찾기
  client.data.reminders
    .filter((v, k) => k < new Date().getTime())
    .each(async (v, k) => {
      // 채널 찾기
      const channel = findChannel(v.channel);
      // 리마인더 보내기
      if (channel) await channel.send(`<@${v.member}> 리마인더: "${v.message}"`);
      // 컬렉션에서 지우기
      client.data.reminders.delete(k);
    });

  // 저장
  reminderJSON.set(Object.fromEntries(client.data.reminders));
}

export default function install(client) {
  client.once(Events.ClientReady, () => {
    // 리마인더 불러오기
    reminderJSON.check();
    client.data.reminders = new Collection(Object.entries(reminderJSON.get()));

    // 문자열 키 숫자로 바꾸기
    client.data.reminders.each((v, k) => {
      if (typeof k === "string") {
        const intk = parseInt(k);
        client.data.reminders.set(intk, v);
        client.data.reminders.delete(k);
      }
    });

    // 5초마다 반복
    check(client);
    setInterval(() => check(client), 5 * 1000);

    // 함수 보내기
    client.data.reminderCheck = check;
  });
}
