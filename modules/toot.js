const conf = require('../config');
const Mastodon = require('mastodon-api');
module.exports = {
  toot: function (status, id, visibility = conf.mastodon.default_visibility) {
    const mstdn = new Mastodon({
      api_url: 'https://' + conf.mastodon.url + '/api/v1/',
      access_token: conf.mastodon.access_token
    });
    mstdn.post('statuses', { status: status, visibility: visibility, in_reply_to_id: id }, function (err, data, response) {
      if (err) {
        console.error(err);
        return false;
      }
    })
    return true;
  },
  mediaToot: function (status, id, image, visibility = conf.mastodon.default_visibility) {
    const mstdn = new Mastodon({
      api_url: 'https://' + conf.mastodon.url + '/api/v1/',
      access_token: conf.mastodon.access_token
    });
    mstdn.post('media', { file: image }).then(res => {
      mstdn.post('statuses', { status: status, visibility: visibility, in_reply_to_id: id, media_ids: [res.data.id] }, function (err, data, response) {
        if (err) {
          console.error(err);
          return false;
        }
      })
    })
    return true;
  },
  startStream: function () {
    const mstdn = new Mastodon({
      api_url: 'https://' + conf.mastodon.url + '/api/v1/',
      access_token: conf.mastodon.access_token
    });
    return stream = mstdn.stream("streaming/user");
  }
}
