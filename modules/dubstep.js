const mstdn = require('./toot');

module.exports = function main(msg) {
  const text = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
  const part1 = text.split('@RISA ')[1].split('ステップバス')[0].substr(0, 4);
  const part2 = text.split('@RISA ')[1].split('ステップバス')[0].substr(0, 2);
  const part3 = text.split('@RISA ')[1].split('ステップバス')[0].substr(0, 1);
  const out = `${part1}${part1}${part1}${part1}${part2}${part2}${part2}${part2}${part3}${part3}${part3}${part3}↑fuckyou !!!イ"ヨ"ヨ"ヨ"イ"ヨ"ヨ"ヨ"wwwウ"ァ"〜ウ"ァ"〜ウンウ"ァ"ウ"ァ"wwwwwwwww`;
  mstdn.toot(`@${msg.data.account.acct} ${out}`, msg.data.status.id, msg.data.status.visibility);
};
