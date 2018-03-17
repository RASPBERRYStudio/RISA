/*
大大吉・大吉・吉・中吉・小吉・半吉・末吉・末小吉・凶・小凶・半凶・末凶・大凶・大大凶
*/
const mstdn = require('./toot');

module.exports = function main(msg) {
  let result1;
  switch (Math.floor(Math.random() * 6)) {
    case 0:
    case 1:
    case 2:
      result1 = [
        '大大吉',
        '大吉',
        '吉',
        '中吉',
        '小吉',
        '半吉',
        '末吉',
        '末小吉',
      ];
      break;
    case 3:
    case 4:
      result1 = [
        '凶',
        '小凶',
        '半凶',
        '大凶',
        '大大凶',
      ];
      break;
    case 5:
      result1 = [
        'キチ',
        'ヌベスコ',
        'まあまあ',
        'ググれ',
        'ぐへへへおぼほほぼびょろろろろろろwwwwww',
        'まじ卍',
        '卍 ﾐﾀﾆｨ 卍',
        '明日校庭の桜の木の下に埋められる',
      ];
      break;
    default:
      result1 = [
        null,
      ];
  }
  const result = result1[Math.floor((Math.random() * result1.length) + 0)];
  mstdn.toot(`@${msg.data.status.account.acct} の運勢:\n\n「${result}」\nだよー！`, msg.data.status.id, msg.data.status.visibility);
};
