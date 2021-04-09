const _ = require('lodash');

function DiagnosisCode(_node) {
  _.extend(this, _node.properties);
}

module.exports = DiagnosisCode;
