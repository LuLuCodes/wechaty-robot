import 'dotenv/config.js';

import { Contact, Message, ScanStatus, WechatyBuilder, log } from 'wechaty';

import qrcodeTerminal from 'qrcode-terminal';

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user);
}

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('');
    log.info(
      'StarterBot',
      'onScan: %s(%s) - %s',
      ScanStatus[status],
      status,
      qrcodeImageUrl,
    );

    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user);
}

async function onMessage(msg: Message) {
  if (msg.self()) {
    return;
  }
  const room = msg.room();
  if (!room) {
    return;
  }
  const topic = await room.topic();
  if (topic !== '吃喝嫖赌') {
    return;
  }

  if (msg.type() !== bot.Message.Type.Text) {
    return;
  }
  const talker = msg.talker();
  const name = talker.name();

  await msg.say(`${name}说： ${msg.text()}`);
}

const bot = WechatyBuilder.build({
  name: 'hongyun-wechat-bot',
});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch((e) => log.error('StarterBot', e));
