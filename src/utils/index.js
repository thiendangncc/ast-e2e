import { TEST_DATA } from "../data";
import { getDriver } from "../support/driver"

export const sleepTime = async (waitTime) => {
  console.log(`Sleep in ${waitTime}`);
  return await getDriver().sleep(waitTime)
}

export function deepGet(obj, query, defaultVal) {
  query = Array.isArray(query) ? query : query.replace(/(\[(\d)\])/g, '.$2').replace(/^\./, '').split('.');
  if (!(query[0] in obj)) {
    return defaultVal;
  }
  obj = obj[query[0]];
  if (obj && query.length > 1) {
    return deepGet(obj, query.slice(1), defaultVal);
  }
  return obj;
}

export const getDataConfig = (configKey) => {
  const data = deepGet(TEST_DATA, configKey);
  return data;
}
