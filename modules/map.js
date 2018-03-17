const request = require('request-promise-native');
const fs = require('fs');
const conf = require('../config');
const mstdn = require('./toot');

module.exports = function main(msg) {
  let address = '';
  const content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
  const location = content.replace(/のマップ|の地図|地図|マップ/g, '');
  const options = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      address: location,
      key: conf.google.geokey,
    },
    json: true,
  };
  request.get(options).then((res) => {
    const lat = res.results[0].geometry.location.lat ? res.results[0].geometry.location.lat : null;
    const lng = res.results[0].geometry.location.lng ? res.results[0].geometry.location.lng : null;
    if (lat === null || lng === null) {
      mstdn.toot(`@${msg.data.account.acct} ${conf.app.missing}`, msg.data.status.id, msg.data.status.visibility);
    }
    const staticmapOptions = {
      uri: 'https://maps.googleapis.com/maps/api/staticmap',
      encoding: null,
      qs: {
        center: `${lat},${lng}`,
        size: '512x512',
        format: 'jpg',
        zoom: 17,
        markers: `${lat},${lng}`,
      },
      json: true,
    };
    address = res.results[0].formatted_address;
    return request.get(staticmapOptions);
  }).then((res) => {
    try {
      fs.writeFileSync('./tmp/map.jpg', res, 'binary');
      mstdn.mediaToot(`@${msg.data.account.acct} 地図だよー!!\n(${address})`, msg.data.status.id, fs.createReadStream('./tmp/map.jpg'), msg.data.status.visibility);
    } catch (err) {
      mstdn.toot(`@${msg.data.account.acct} ${conf.app.error}`, msg.data.status.id, msg.data.status.visibility);
    }
  }).catch((err) => {
    if (err) {
      mstdn.toot(`@${msg.data.account.acct} ${conf.app.error}`, msg.data.status.id, msg.data.status.visibility);
    }
  });
};
