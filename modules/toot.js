const conf = require('../config');
const Mastodon = require('mastodon-api')
module.exports = {
  toot: function (status, visibility = conf.mastodon.default_visibility) {
    const mstdn = new Mastodon({
      api_url: 'https://' + conf.mastodon.url + '/api/v1/',
      access_token: conf.mastodon.access_token
    });
    mstdn.post('statuses', { status: status, visibility: visibility }, function (err, data, response) {
      if (err){
        console.error(err);
        return false;
      }
      console.log(data);
      console.log(response);
      return true;
    })
  },
  startStream: function () {
    const mstdn = new Mastodon({
      api_url: 'https://' + conf.mastodon.url + '/api/v1/',
      access_token: conf.mastodon.access_token
    });
    return stream = mstdn.stream("streaming/user");
  }
}
