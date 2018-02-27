const request = require('request-promise-native');
const fs = require('fs');
const path = require('path');
const conf = require('../config');
const mstdn = require('./toot');
module.exports.main = function (msg) {
  let content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
  let acct = msg.data.account.acct;
  var ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
    '\ud7c9[\ude00-\udeff]',
    '[\u2600-\u27BF]'
  ];
  var ex = new RegExp(ranges.join('|'), 'g');
  var options = {
    uri: `${conf.docomo.url}?APIKEY=${conf.docomo.apikey}`,
    body: {
      utt: content,
      nickname: msg.data.account.display_name.replace(ex, ''),
      context: getContext(acct),
      t: 20
    },
    json: true
  };
  request.post(options).then(function (res) {
    let context = res.context;
    fs.writeFileSync(`${__dirname}/../contexts/${acct}`, context);
    mstdn.toot(`@${acct} ${res.utt}`, msg.data.status.id, msg.data.status.visibility)
    }).catch(function (err) {
    if (err) {
      console.error(err);
      mstdn.toot(`@${acct} ${conf.app.error}`, msg.data.status.id, msg.data.status.visibility)
    }
  });
}

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