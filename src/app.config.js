import 'dotenv/config';

export const AppConfig = {
  appUrl: process.env.APP_URL || "http://dev-ams.nccsoft.vn/",
  browserName: process.env.BROWSER || "chrome-headless",
  width: process.env.WIDTH || 1920,
  height: process.env.HEIGHT || 1080,
  implicitWait: +process.env.IMPLICIT_WAIT || 0,
  pageLoadWait: +process.env.PAGE_LOAD_WAIT || 15000,
  waitInterval: +process.env.WAIT_INTERVAL || 1000
}
