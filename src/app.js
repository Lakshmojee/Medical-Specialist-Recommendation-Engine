require('url-loader?name=[name].[ext]!./assets/images/neo4j_background3.gif');
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
    $("table#results tbody").empty();
    fetchDiagnosisCodes(this.value);
  });
});

function search() {
  let serachText = $("#search-form input[name=search]").val();
  const query = $("#search-form select[name=diagnosis]").val();

  api
    .searchRecommendations(query)
    .then(records => {
      const t = $("table#results tbody").empty();
      if (records) {
        let erVists = Math.floor(Math.random()*5);
        records.forEach(record => {
          $("<tr><td>" + record.practitioner_name + "</td><td>" + record.practitioner_add + "</td><td>"  + record.Email + "</td><td>"+ record.claimAmount + "</td><td>" + erVists + "</td></tr>").appendTo(t);
          erVists = erVists + (Math.floor(Math.random()*50));
        });
      } else {
        $("<tr><td colspan='5'>No recommendations available.</td></tr>").appendTo(t);
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
          $("<option value='" + record.patient_id + "'>" + record.patient_name + "</option>").appendTo(t);
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
      if (records) {
        records.forEach(record => {
          $("<option value='" + record.productCode + "'>" + record.productDisplay + "</option>").appendTo(t);
        });
      }
    });
}
