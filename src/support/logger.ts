let interceptFn: Function | null = null;

(console as any).originalLog = console.log;

function log(...args) {
  (console as any).originalLog(...args);
  pushIntercept(...args);
}

function formatLog(msg) {
  try {
    return ['string', 'number', 'boolean'].includes(typeof msg)
      ? msg
      : JSON.stringify(msg);
  } catch (e) {
    return msg;
  }
}

function pushIntercept(...args) {
  const msgs = args.map((msg) => formatLog(msg));
  const timestamp = new Date().toLocaleTimeString();
  const sentence = msgs.join(' ');
  const prettySentence = `${timestamp}: ${sentence}`;
  interceptFn && interceptFn(prettySentence);
}

function clear() {
  interceptFn = null;
}

function init() {
  console.log = log;
}

function intercept(logFn: Function) {
  interceptFn = logFn;
}

export default {
  init,
  log,
  clear,
  intercept,
};
