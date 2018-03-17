const conf = require('./config');
const mstdn = require('./modules/toot');
const map = require('./modules/map');
const nakau = require('./modules/nakau');
const train = require('./modules/train');
const omikuji = require('./modules/omikuji');
const shine = require('./modules/shine');
const dubstep = require('./modules/dubstep');
const talk = require('./modules/talk');

const listener = mstdn.startStream();
listener.on('message', (msg) => {
  if (msg.event === 'notification' && msg.data.status.account.acct !== conf.mastodon.id) {
    if (msg.data.type === 'mention') {
      const content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '').replace(/\s/g, '');
      if (content === 'にゃーん') {
        mstdn.toot(`@${msg.data.account.acct} にゃーん`, msg.data.status.id);
      } else if (content.match(/のなか卯/g)) {
        nakau.main(msg);
      } else if (content.match(/地図|マップ/g)) {
        map.main(msg);
      } else if (content.match(/遅延情報/g)) {
        train.main(msg);
      } else if (content === 'おみくじ') {
        omikuji.main(msg);
      } else if (content.match(/(.*)(?=が死んだ)/)) {
        shine.main(msg);
      } else if (content.match(/(.*)(?=ステップバス)/)) {
        dubstep.main(msg);
      } else {
        talk.main(msg);
      }
    }
  }
});
