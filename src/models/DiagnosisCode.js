const _ = require('lodash');

function DiagnosisCode(_node) {
    console.log("Laxmoji");
    console.log(_node);
  _.extend(this, _node.properties);
}

module.exports = DiagnosisCode;
