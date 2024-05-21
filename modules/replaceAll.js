// 문자열 안에서 특정 부분을 모두 바꾸기
export function replaceAll(str, filter) {
  let newStr = str;
  for (const key of filter.keys()) {
    newStr = newStr.split(key).join(filter.get(key));
  }
  return newStr;
}
