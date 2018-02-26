const conf = require('./config');
const mstdn = require('./modules/toot');
let listener = mstdn.startStream();
listener.on('message', msg => {
  if (msg.event === 'notification') {
    let content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
    if (content.match(/のなか卯/g)) {
      require('./modules/nakau').main(msg);
    }else{
      require('./modules/talk').main(msg);
    }
  }
})