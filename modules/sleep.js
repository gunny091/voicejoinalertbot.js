// 기다리기
export function sleep(ms) {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
}
