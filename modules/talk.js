const request = require('request-promise-native');
const fs = require('fs');
const conf = require('../config');
const mstdn = require('./toot');

function getContext(acct) {
  let context;
  try {
    fs.statSync(`${__dirname}/../contexts/${acct}`);
    context = fs.readFileSync(`${__dirname}/../contexts/${acct}`, 'utf8');
  } catch (err) {
    context = '';
    fs.writeFileSync(`${__dirname}/../contexts/${acct}`, '');
  }
  return context;
}

module.exports = function main(msg) {
  const content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
  const ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
    '\ud7c9[\ude00-\udeff]',
    '[\u2600-\u27BF]',
  ];
  const ex = new RegExp(ranges.join('|'), 'g');
  const options = {
    uri: `${conf.docomo.url}?APIKEY=${conf.docomo.apikey}`,
    body: {
      utt: content,
      nickname: msg.data.account.display_name.replace(ex, ''),
      context: getContext(msg.data.account.acct),
      t: 20,
    },
    json: true,
  };
  request.post(options).then((res) => {
    fs.writeFileSync(`${__dirname}/../contexts/${msg.data.account.acct}`, res.context);
    mstdn.toot(`@${msg.data.account.acct} ${res.utt}`, msg.data.status.id, msg.data.status.visibility);
  }).catch((err) => {
    if (err) {
      mstdn.toot(`@${msg.data.account.acct} ${conf.app.error}`, msg.data.status.id, msg.data.status.visibility);
    }
  });
};
