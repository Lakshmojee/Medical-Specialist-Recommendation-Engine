require('file-loader?name=[name].[ext]!./assets/images/neo4j_background3.gif');
require('url-loader?name=[name].[ext]!./assets/images/IBM_Logo.png');
require('url-loader?name=[name].[ext]!./assets/images/Slide1.png');
require('url-loader?name=[name].[ext]!./assets/images/Slide2.png');
require('url-loader?name=[name].[ext]!./assets/images/Slide3.png');
require('url-loader?name=[name].[ext]!./assets/images/Slide4.png');
const api = require('./neo4jApi');

$(function () {
  fetchPatients();

  $("table#results tbody").empty();
  $("#search-form").submit(e => {
    e.preventDefault();
    search();
  });

  $("#search-form select[name=patient]").on("change", function(){
    fetchDiagnosisCodes(this.value);
  });
});

function search() {
  let serachText = $("#search-form input[name=search]").val();
  let patientName = $("#search-form select[name=patient]").val();
  let diagnosisCode = $("#search-form select[name=diagnosis]").val();
  const query = "searchText=" + serachText + "&patientName=" + patientName + "&diagnosisCode=" + diagnosisCode;

  api
    .searchRecommendations(query)
    .then(records => {
      const t = $("table#results tbody").empty();
      if (records) {
        records.forEach(record => {
          $("<tr><td>" + record.title + "</td><td>" + record.released + "</td><td>" + record.released + "</td><td>" + record.tagline + "</td></tr>").appendTo(t);
        });
      }
    });
}

function fetchPatients(){
  api
    .getPatients("")
    .then(records => {
      const t = $("select[name=patient]").empty();
      $("<option>Choose...</option>").appendTo(t);
      if (records) {
        records.forEach(record => {
          $("<option value='" + record.name + "'>" + record.name + "</option>").appendTo(t);
        });
      }
    });
}

function fetchDiagnosisCodes(pName){
  api
    .getDiagnosisCodes(pName)
    .then(records => {
      const t = $("select[name=diagnosis]").empty();
      $("<option>Choose...</option>").appendTo(t);
      console.log(records);
      if (records) {
        records.forEach(record => {
          $("<option value='" + record.title + "'>" + record.title + "</option>").appendTo(t);
        });
      }
    });
}
