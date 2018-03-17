const conf = require('../config');
const mstdn = require('./toot');
const fs = require('fs');
const request = require('request-promise-native');
const gm = require('gm');

module.exports = function main(msg) {
  msg.data.status.mentions.some((mention) => {
    if (mention.username !== conf.mastodon.id.replace(/@/, '')) {
      mstdn.getAccount(mention.id)
        .then(account => request({
          url: account.avatar_static,
          method: 'GET',
          encoding: null,
        })).then((data) => {
          fs.writeFileSync('./tmp/avatar.png', data);
          gm('./tmp/avatar.png')
            .resize(80, 80)
            .write('./tmp/avatar.png', () => {
              gm('./images/osoushiki_iei_frame.png')
                .composite('./tmp/avatar.png')
                .geometry('+65+90')
                .write('./tmp/iei_avatar.png', () => {
                  const img = fs.createReadStream('./tmp/iei_avatar.png');
                  mstdn.mediaToot(`@${msg.data.account.acct} この人でなし！`, msg.data.status.id, img, msg.data.status.visibility);
                  return true;
                });
            });
        });
    }
    return false;
  });
};
