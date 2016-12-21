const createClient = require('./client').create;

const proto = {
  get frinkiac() {
    return createClient('https://frinkiac.com');
  },
  get morbotron() {
    return createClient('https://morbotron.com');
  }
};

module.exports = Object.create(proto);
