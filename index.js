const conf = require('./config');
const mstdn = require('./modules/toot');
let listener = mstdn.startStream();
listener.on('message', msg => {
  if (msg.event === 'notification') {
    let content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '').replace(/\s/g, '');
    let acct = msg.data.account.acct;
    if (content === 'にゃーん') {
      mstdn.toot(`@${acct} にゃーん`, msg.data.status.id)
    } else if (content.match(/のなか卯/g)) {
      require('./modules/nakau').main(msg);
    } else if (content.match(/地図|マップ/g)) {
      require('./modules/map').main(msg);
    } else {
      require('./modules/talk').main(msg);
    }
  }
})