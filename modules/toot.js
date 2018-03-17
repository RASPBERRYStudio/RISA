const conf = require('../config');
const Mastodon = require('mastodon-api');

function errorLog(err) {
  throw new Error(err);
}

module.exports = {
  toot(status, id, visibility = conf.mastodon.default_visibility) {
    const mstdn = new Mastodon({
      api_url: `https://${conf.mastodon.url}/api/v1/`,
      access_token: conf.mastodon.access_token,
    });
    if (id !== null) {
      mstdn.post('statuses', { status, visibility, in_reply_to_id: id }, err => !!err);
    } else {
      mstdn.post('statuses', { status, visibility }, err => !!err);
    }
  },
  mediaToot(status, id, image, visibility = conf.mastodon.default_visibility) {
    const mstdn = new Mastodon({
      api_url: `https://${conf.mastodon.url}/api/v1/`,
      access_token: conf.mastodon.access_token,
    });
    mstdn.post('media', { file: image }).then((res) => {
      mstdn.post('statuses', {
        status, visibility, in_reply_to_id: id, media_ids: [res.data.id],
      }, err => !!err);
    }).catch((err) => {
      errorLog(err);
    });
    return true;
  },
  startStream() {
    const mstdn = new Mastodon({
      api_url: `https://${conf.mastodon.url}/api/v1/`,
      access_token: conf.mastodon.access_token,
    });
    return mstdn.stream('streaming/user');
  },
  getAccount(id) {
    const mstdn = new Mastodon({
      api_url: `https://${conf.mastodon.url}/api/v1/`,
      access_token: conf.mastodon.access_token,
    });
    return mstdn.get(`accounts/${id}`).then(res => res.data);
  },
};

