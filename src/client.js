const proto = {
  get searchApiUrl() {
    return `${this.siteUrl}/api/search`;
  },
  get captionApiUrl() {
    return `${this.siteUrl}/api/caption`;
  },
};

function create(siteUrl) {
  return Object.assign(Object.create(proto), {siteUrl});
}

module.exports = {
  create
};
