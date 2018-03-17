const request = require('request-promise-native');
const mstdn = require('./toot');

const url = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';
module.exports = function main(msg) {
  const options = {
    uri: url,
  };
  request.get(options).then((res) => {
    let out = '遅延中:\n';
    JSON.parse(res).forEach((data) => {
      // 自動投稿の場合、新規遅延と遅延終了も表示
      out += `${data.name}(${data.company})\n`;
    });
    mstdn.toot(`@${msg.data.account.acct}\n${out}`, msg.data.status.id, msg.data.status.visibility);
  });
};
