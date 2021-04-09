const _ = require('lodash');

function Provider(_node1, _node2) {
    var temp = _.merge(_node1.properties, _node2.properties);
  _.extend(this, temp);
}

module.exports = Provider;
