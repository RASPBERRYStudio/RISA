const request = require('request-promise-native');
const fs = require('fs');
const path = require('path');
const conf = require('../config');
const mstdn = require('./toot');
let listener = mstdn.startStream();
listener.on('message', msg => {
  if (msg.event === 'notification') {
    let content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
    let acct = msg.data.account.acct;
    var options = {
      uri: `${conf.docomo.url}?APIKEY=${conf.docomo.apikey}`,
      body: {
        utt: content,
        nickname: msg.data.account.display_name,
        context: getContext(acct),
        t: 20
      },
      json: true
    };
    request.post(options).then(function (res) {
      let context = res.context;
      fs.writeFileSync(`${__dirname}/../contexts/${acct}`, context);
      mstdn.toot(`@${acct} ${res.utt}`)
      }).catch(function (err) {
      if (err) {
        console.error(err);
        mstdn.toot(`@${acct} ？`)
      }
    });
  }
})

function getContext(acct) {
  let context;
  try {
    fs.statSync(`${__dirname}/../contexts/${acct}`)
    context = fs.readFileSync(`${__dirname}/../contexts/${acct}`, 'utf8');
  } catch (err) {
    context = '';
    fs.writeFileSync(`${__dirname}/../contexts/${acct}`, '');
  }
  return context;
}