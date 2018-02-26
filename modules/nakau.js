const request = require('request-promise-native');
const fs = require('fs');
const conf = require('../config');
const mstdn = require('./toot');

module.exports.main = function (msg) {
  let address = '';
  let content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.mastodon.id, '');
  let acct = msg.data.account.acct;
  location = content.replace(/のなか卯|近くのなか卯/g, '');
  location += ' なか卯';
  var options = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      address: location,
      key: conf.google.geokey
    },
    json: true
  };
  request.get(options).then(function (res) {
    let lat;
    let lng;
    try {
      lat = res.results[0].geometry.location.lat;
      lng = res.results[0].geometry.location.lng;
    } catch (error) {
      mstdn.toot(`@${acct} ${conf.app.missing}`, msg.data.status.id)
      return;
    }
    var options = {
      uri: 'https://maps.googleapis.com/maps/api/staticmap',
      encoding: null,
      qs: {
        center: `${lat},${lng}`,
        size: '512x512',
        format: 'jpg',
        zoom: 17,
        markers: `${lat},${lng}`
      },
      json: true
    };
    address = res.results[0].formatted_address;
    return request.get(options);
  }).then((res) => {
    try {
      fs.writeFileSync('./tmp/map.jpg', res, 'binary');
      mstdn.mediaToot(`@${acct} 地図だよー!!\n(${address})`, msg.data.status.id, fs.createReadStream('./tmp/map.jpg'))
    } catch (err) {
      console.error(err);
      mstdn.toot(`@${acct} ${conf.app.error}`, msg.data.status.id)
    }
  }).catch(function (err) {
    if (err) {
      console.error(err);
      mstdn.toot(`@${acct} ${conf.app.error}`, msg.data.status.id)
    }
  });
}