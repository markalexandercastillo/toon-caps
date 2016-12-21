const axios = require('axios')
  , qs = require('querystring')
  , wrap = require('word-wrap')
  , camelcaseKeys = require('camelcase-keys')
  ;

/**
 * Frinkiac/Morbotron API client prototype
 * @type {Object}
 */
const proto = {
  /**
   * Getter for the search API endpoint URL
   * @return {String}
   */
  get searchApiUrl() {
    return `${this.siteUrl}/api/search`;
  },
  /**
   * Getter for the caption API endpoint URL
   * @return {String}
   */
  get captionApiUrl() {
    return `${this.siteUrl}/api/caption`;
  },
  /**
   * Returns the URL of the image for the given screenshot
   * @return {String}
   */
  getImageUrl(screenshot) {
    return `${this.siteUrl}/img/${screenshot.episode}/${screenshot.timestamp}.jpg`;
  },
  /**
   * Returns the URL of an image for the given screenshot with the given
   * text overlaying it
   * @return {String}
   */
  getMemeUrl(screenshot, text) {
    // text is word wrapped at 25 characters and base64-encoded
    const b64lines = new Buffer(wrap(text, {width: 25})).toString('base64');
    return `${this.siteUrl}/meme/${screenshot.episode}/${screenshot.timestamp}.jpg?b64lines=${b64lines}`;
  },
  /**
   * Returns caption data matching the given screenshot data.
   * Eg.:
   * {
   *   "episode": {
   *     "id": 444,
   *     "key": "S06E06",
   *     "season": 6,
   *     "episodeNumber": 6,
   *     "title": "Treehouse of Horror V",
   *     "director": "Jim Reardon",
   *     "writer": "Greg Daniels, Dan McGrath, David S. Cohen & Bob Kushell",
   *     "originalAirDate": "30-Oct-94",
   *     "wikiLink": "https://en.wikipedia.org/wiki/Treehouse_of_Horror_V"
   *   },
   *   "frame": {
   *     "id": 701025,
   *     "episode": "S06E06",
   *     "timestamp": 1026358
   *   },
   *   "subtitles": [
   *     {
   *       "id": 53923,
   *       "representativeTimestamp": 1025190,
   *       "episode": "S06E06",
   *       "startTimestamp": 1023200,
   *       "endTimestamp": 1027200,
   *       "content": "Jimbo, this is by far the worst... mmm.",
   *       "language": "en"
   *     },
   *     ...
   *   ],
   *   "nearby": [
   *     {
   *       "id": 701024,
   *       "episode": "S06E06",
   *       "timestamp": 1025857
   *     },
   *     ...
   *   ]
   * }
   * @return {Promise}
   */
  getCaptions(screenshot) {
    const requestUrl = `${this.captionApiUrl}?${qs.stringify({
      e: screenshot.episode,
      t: screenshot.timestamp
    })}`;
    return axios.get(requestUrl)
      .then(({data}) => camelcaseKeys(data, {deep: true}))
      ;
  },
  /**
   * Returns a promise resolving to an array ofscreenshot data matching the
   * given search terms.
   * Eg: [
   *   {
   *     id: 701025,
   *     episode: 'S06E06',
   *     timestamp: 1026358
   *   },
   *   ...
   * ]
   * @return {Promise}
   */
  searchScreenshots(terms) {
    const requestUrl = `${this.searchApiUrl}?${qs.stringify({
      q: terms
    })}`;
    return axios.get(requestUrl)
      .then(({data}) => data.map(screenshot => camelcaseKeys(screenshot, {deep: true})));
  }
};

/**
 * For getting client instances
 * @param  {String} siteUrl Base URL of the service to hit
 * @param  {Function} debug Debug logging function, takes a string
 * @return {Object}
 */
function create(siteUrl) {
  return Object.assign(Object.create(proto), {siteUrl});
}

module.exports = {
  create
};
