require('file-loader?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
const Patient = require('./models/Patient');
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
  console.log("Laxmoji");
  console.log("==========");
  console.log(queryString);
  console.log("==========");
  queryString = "Matrix";
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (movie:Movie) \
      WHERE movie.title =~ $title \
      RETURN movie',
      {title: '(?i).*' + queryString + '.*'})
    )
    .then(result => {
      return result.records.map(record => {
        return new Patient(record.get('movie'));
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
      tx.run('MATCH (person:Person) \
      WHERE person.name =~ $name \
      RETURN person LIMIT 25',
      {name: '(?i).*' + queryString + '.*'})
    )
    .then(result => {
      return result.records.map(record => {
        return new Patient(record.get('person'));
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
  console.log(queryString);
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) \
      where p.name= $name \
      RETURN m LIMIT 25',
      {name: '(?i).*' + queryString + '.*'})
    )
    .then(result => {
      return result.records.map(record => {
        return new Patient(record.get('movie'));
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

