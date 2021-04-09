const _ = require('lodash');

function Patient(_node) {
  _.extend(this, _node.properties);
}

module.exports = Patient;
