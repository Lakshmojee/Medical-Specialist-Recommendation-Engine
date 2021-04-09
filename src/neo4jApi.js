require('file-loader?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
const Patient = require('./models/Patient');
const Provider = require('./models/Provider');
const DiagnosisCode = require('./models/DiagnosisCode');
const _ = require('lodash');

const neo4j = window.neo4j;
const neo4jUri = process.env.NEO4J_URI;
const neo4jVersion = process.env.NEO4J_VERSION;
let database = process.env.NEO4J_DATABASE;
if (!neo4jVersion.startsWith("4")) {
  database = null;
}
const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

console.log(`Database running at ${neo4jUri}`)

function searchRecommendations(queryString) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (n:Claims), (p:Practitioner) WHERE n.practitioner_id = p.practitioner_id and n.productCode= "' + queryString +'" RETURN n, p ORDER BY p.practitioner_name DESC')
    )
    .then(result => {
      return result.records.map(record => {
        return new Provider(record.get('p'), record.get('n'));
      });
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getPatients(queryString) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (p:Patients) RETURN p LIMIT 25')
    )
    .then(result => {
      return result.records.map(record => {
        return new Patient(record.get('p'));
      });
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getDiagnosisCodes(queryString) {

  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (n:Claims), (p:Patients) WHERE p.patient_id = "' + queryString + '" AND n.patient_id = p.patient_id RETURN n LIMIT 25')
    )
    .then(result => {

      return result.records.map(record => {
        return new DiagnosisCode(record.get('n'));
      });
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

exports.searchRecommendations = searchRecommendations;
exports.getPatients = getPatients;
exports.getDiagnosisCodes = getDiagnosisCodes;

