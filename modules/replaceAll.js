export function replaceAll(str, filter) {
  let newStr = str;
  for (const key of filter.keys()) {
    newStr = newStr.split(key).join(filter.get(key));
  }
  return newStr;
}
