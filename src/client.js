const axios = require('axios')
  , qs = require('querystring')
  , wrap = require('word-wrap')
  , camelcaseKeys = require('camelcase-keys')
  ;

const proto = {
  get searchApiUrl() {
    return `${this.siteUrl}/api/search`;
  },
  get captionApiUrl() {
    return `${this.siteUrl}/api/caption`;
  },
  getImageUrl(screenshot) {
    return `${this.siteUrl}/img/${screenshot.episode}/${screenshot.timestamp}.jpg`;
  },
  getMemeUrl(screenshot, text) {
    // text is word wrapped at 25 characters and base64-encoded
    const b64lines = new Buffer(wrap(text, {width: 25})).toString('base64');
    return `${this.siteUrl}/meme/${screenshot.episode}/${screenshot.timestamp}.jpg?b64lines=${b64lines}`;
  },
  getCaptions(screenshot) {
    const requestUrl = `${this.captionApiUrl}?${qs.stringify({
      e: screenshot.episode,
      t: screenshot.timestamp
    })}`;
    return axios.get(requestUrl)
      .then(({data}) => camelcaseKeys(data, {deep: true}))
      ;
  },
  searchScreenshots(terms) {
    const requestUrl = `${this.searchApiUrl}?${qs.stringify({
      q: terms
    })}`;
    return axios.get(requestUrl)
      .then(({data}) => data.map(screenshot => camelcaseKeys(screenshot, {deep: true})));
  }
};

function create(siteUrl) {
  return Object.assign(Object.create(proto), {siteUrl});
}

module.exports = {
  create
};
