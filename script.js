const population = "http://wildboy.uib.no/~tpe056/folk/104857.json";
const employment = "http://wildboy.uib.no/~tpe056/folk/100145.json";
const education = "http://wildboy.uib.no/~tpe056/folk/85432.json";
var loadedDocuments = 0;

function getData(url, obj, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true)
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      obj.data = JSON.parse(xhttp.responseText)
      if (callback) {callback(obj)}};
  }
  xhttp.send()
}

function Dataset(url) {
  this.url = url;
  this.onload = null;
  this.getNames = function(){return nameRetriver(this.data)};
  this.getIDs = function() {return idRetriver(this.data)};
  this.getInfo = function(municipalityNr) {return infoRetriver(municipalityNr, this.data)};
  this.load = function(){
    if (this.url) {
      getData(this.url, this, this.onload);
    }
  };
}

function nameRetriver(data) {
  let obj = data['elementer'];
  const municipalityName = Object.keys(obj);
  return municipalityName
}

function idRetriver(data) {
  let list = [];
  let obj = data['elementer'];
  for (let [key, values] of Object.entries(obj)) {
    let municipalityNr = values['kommunenummer']
    list.push(municipalityNr);
  }
  return list
}

function infoRetriver(municipalityNr, data) {
  let municipality = data['elementer']
  municipalityNr = ''+municipalityNr
  for(let [key, values] of Object.entries(municipality)) {
    if (municipalityNr == values['kommunenummer']) {
      let obj = {kommunenavn: key}
      let newObj = Object.assign(obj,municipality[key])
      return newObj;
    }
  }
}

function manageOverviewData(database) {
  let obj = database['elementer'];
  let tabel = document.getElementById('fulldata');
  let tr = '<tr>'
  for (let [key, values] of Object.entries(obj)) {
    tr += `<td>${key}</td>`;
    Object.entries(values).forEach((element) => {
      if (isObject(element[1]) === false) {
        tr += `<td> ${element[1]} </td>`;
      }
    });
    let lastYear = values.Menn[2017] + values.Kvinner[2017];
    let thisYear = values.Menn[2018] + values.Kvinner[2018];
    let popInc = populationIncrease(lastYear,thisYear);
    tr += `<td>${thisYear}</td><td>${popInc}</td></tr>`;
  tabel.innerHTML = tr;
  }
}

function checkWinner (kom1, kom2){ //Function to loop over the educational table to assign a winner
  kom1points = 0;
  kom2points = 0;
  let arr = [kom1, kom2];
  let table = document.getElementById("educationTable");
  for (let i = 2; i < 7; i++){
    if (table.rows[i].cells[1].innerHTML > table.rows[i].cells[3].innerHTML){
      table.rows[i].cells[1].style.backgroundColor = "#9feda7";
      table.rows[i].cells[3].style.backgroundColor = "#eda49f";
      kom1points ++;
    }
    if (table.rows[i].cells[1].innerHTML < table.rows[i].cells[3].innerHTML) {
      table.rows[i].cells[3].style.backgroundColor = "#9feda7";
      table.rows[i].cells[1].style.backgroundColor = "#eda49f";
      kom2points ++;
    }
    if (table.rows[i].cells[1].innerHTML == table.rows[i].cells[3].innerHTML) {
      table.rows[i].cells[1].style.backgroundColor = "#f7c96d";
      table.rows[i].cells[3].style.backgroundColor = "#f7c96d";
    }
    if (table.rows[i].cells[2].innerHTML > table.rows[i].cells[4].innerHTML) {
      table.rows[i].cells[2].style.backgroundColor = "#9feda7";
      table.rows[i].cells[4].style.backgroundColor = "#eda49f";
      kom1points ++;
    }
    if (table.rows[i].cells[2].innerHTML < table.rows[i].cells[4].innerHTML) {
      table.rows[i].cells[4].style.backgroundColor = "#9feda7";
      table.rows[i].cells[2].style.backgroundColor = "#eda49f";
      kom2points ++;
    }
    if (table.rows[i].cells[2].innerHTML == table.rows[i].cells[4].innerHTML) {
      table.rows[i].cells[2].style.backgroundColor = "#f7c96d";
      table.rows[i].cells[4].style.backgroundColor = "#f7c96d";
    }
  }
  if (kom1points > kom2points) {
      document.getElementById("highestscore").innerHTML = `Kommunen som vinner flest utdanningskategorier er: ${kom1}!`;
  } else if (kom1points < kom2points) {
    document.getElementById("highestscore").innerHTML = `Kommunen som vinner flest utdanningskategorier er: ${kom2}!`;
  } else {
    document.getElementById("highestscore").innerHTML = `${kom1} og ${kom2} vinner like mange kategorier, så det blir uavgjort.`;
  }
}

function compareEducation(kom1, kom2){ //Function to create a table with educational data
  document.getElementById("educationTable").style.display="table";
  let utd1 = educationData.getInfo(kom1);
  let utd2 = educationData.getInfo(kom2);

  var edLvl = [
    ["01", "Grunnskole"],
    ["02a","Vidergående Skole"],
    ["11","Fagskole"],
    ["03a","Universitets- høgskolenivå kort"],
    ["04a","Universitets- høgskolenivå lang"]]

  let tableDetails = document.getElementById("educationTable");
  let table = "<tbody>";
  table +=
   `<tr><th>Høyest fullført utdanning</th><th colspan=2>${utd1["kommunenavn"]}</th><th colspan=2>${utd2["kommunenavn"]}</th></tr>` +
   `<tr><td></td><td>Menn</td><td>Kvinner</td><td>Menn</td><td>Kvinner</td></tr>` +
   `<tr><td>${edLvl[0][1]}</td><td>${utd1[edLvl[0][0]]["Menn"][2017]}</td><td>${utd1[edLvl[0][0]]["Kvinner"][2017]}</td><td>${utd2[edLvl[0][0]]["Menn"][2017]}</td><td>${utd2[edLvl[0][0]]["Kvinner"][2017]}</td></tr>` +
   `<tr><td>${edLvl[1][1]}</td><td>${utd1[edLvl[1][0]]["Menn"][2017]}</td><td>${utd1[edLvl[1][0]]["Kvinner"][2017]}</td><td>${utd2[edLvl[1][0]]["Menn"][2017]}</td><td>${utd2[edLvl[1][0]]["Kvinner"][2017]}</td></tr>` +
   `<tr><td>${edLvl[2][1]}</td><td>${utd1[edLvl[2][0]]["Menn"][2017]}</td><td>${utd1[edLvl[2][0]]["Kvinner"][2017]}</td><td>${utd2[edLvl[2][0]]["Menn"][2017]}</td><td>${utd2[edLvl[2][0]]["Kvinner"][2017]}</td></tr>` +
   `<tr><td>${edLvl[3][1]}</td><td>${utd1[edLvl[3][0]]["Menn"][2017]}</td><td>${utd1[edLvl[3][0]]["Kvinner"][2017]}</td><td>${utd2[edLvl[3][0]]["Menn"][2017]}</td><td>${utd2[edLvl[3][0]]["Kvinner"][2017]}</td></tr>` +
   `<tr><td>${edLvl[4][1]}</td><td>${utd1[edLvl[4][0]]["Menn"][2017]}</td><td>${utd1[edLvl[4][0]]["Kvinner"][2017]}</td><td>${utd2[edLvl[4][0]]["Menn"][2017]}</td><td>${utd2[edLvl[4][0]]["Kvinner"][2017]}</td></tr>` +
   `</tbody>`
  tableDetails.innerHTML = table;
  checkWinner(utd1["kommunenavn"], utd2["kommunenavn"]);
}

function manageDetailsData(municipalityNr){
  let tableDetails = document.getElementById('tableDetails');
  let population = populationData.getInfo(municipalityNr);
  let education = educationData.getInfo(municipalityNr);
  let employed = employmentData.getInfo(municipalityNr);
  let totalPopulation = population.Menn[2018] + population.Kvinner[2018];
  let pastPopulation = population.Menn[2017] + population.Kvinner[2017];
  let table = '<table><tbody>'
  table += `<tr><td>Kommunenavn</td><td colspan=2>${population['kommunenavn']}</td></tr>`
  + `<tr><td>Kommunenummer</td><td colspan=2>${population['kommunenummer']}</td></tr>`
  + `<tr><td>Befolkning</td><td colspan=2>${totalPopulation}</td></tr>`
  + `<tr><td>Sysselsetting</td><td>${((employed['Begge kjønn'][2018]/100)*totalPopulation).toFixed(0)}</td>`
  + `<td>${employed['Begge kjønn'][2018]}%</td></tr>`
  + `<tr><td>Høyere Utdanning</td><td>${totalEducation(pastPopulation,higherEducation(education))}</td>`
  + `<td>${higherEducation(education)}%</td></tr>`
  + `</tbody></table>`;
  tableDetails.innerHTML = table;
  displayEducationTable(education);
  displayPopulationTable(population);
  displayEmploymentTable(employed);
}

function displayEducationTable(obj){
  let years = [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
  let educationTable = document.getElementById('educationInfo');
  let eduCat = educationData.data.datasett.kategorier;
  let heading = '<h2>Utdanningstall</h2>';
  let fullInfo = '';
  for (let [key, value] of Object.entries(eduCat)) {
    let table = '<table class="tabledata"><tbody><thead><tr><th></th>'
    let info = `<h3>${value}</h3>`
    let level = obj[key];
    years.forEach((year) => {table += `<th>${year}</th>`});
    table += '</tr></thead><tr><td>Menn</td>';
    years.forEach((year) => {table += `<td>${level.Menn[year]}%</td>`});
    table += '</tr><tr><td>Kvinner</td>';
    years.forEach((year) => {table += `<td>${level.Kvinner[year]}%</td>`});
    table += '</tr></tbody></table>'
    fullInfo += info + table;
  }

  educationTable.innerHTML = heading + fullInfo;
}

function displayEmploymentTable(obj){
  let years = [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
  let employmentTable = document.getElementById('employmentInfo');
  let heading = '<h2>Sysselsatte</h2>';
  let table = '<table class="tabledata"><tbody><thead><tr><th></th>';
  years.forEach((year) => {table += `<th>${year}</th>`});
  table += '</tr></thead><tr><td>Menn</td>';
  years.forEach((year) => {table += `<td>${obj.Menn[year]}%</td>`});
  table += '</tr><tr><td>Kvinner</td>';
  years.forEach((year) => {table += `<td>${obj.Kvinner[year]}%</td>`});
  table += '</tr></tbody></table>'

  employmentTable.innerHTML = heading + table
}

function displayPopulationTable(obj){
  let years = [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
  let populationTable = document.getElementById('populationInfo');
  let heading = '<h2>Befolkningstall</h2>';
  let table = '<table class="tabledata"><tbody><thead><tr><th></th>';
  years.forEach((year) => {table += `<th>${year}</th>`});
  table += '</tr></thead><tr><td>Menn</td>';
  years.forEach((year) => {table += `<td>${obj.Menn[year]}</td>`});
  table += '</tr><tr><td>Kvinner</td>';
  years.forEach((year) => {table += `<td>${obj.Kvinner[year]}</td>`});
  table += '</tr></tbody></table>'

  populationTable.innerHTML = heading + table
}

function isObject(obj) {
  return obj === Object(obj);
}

function populationIncrease(past,present) {
  if (isNaN(present/past)) {
    return `0%`
  }
  if (past > present) {
    return `-${((present/past)+0.001).toFixed(2)}%`;
  }
  return `${(present/past).toFixed(2)}%`;
}

function totalEducation(population, percentage) {
  return ((percentage/100)*population).toFixed(0);
}

function higherEducation(data) {
  let total = ((data['03a']['Menn'][2017]
              + data['03a']['Kvinner'][2017]
              + data['04a']['Kvinner'][2017]
              + data['04a']['Kvinner'][2017])/2).toFixed(1);
  return total;
}

function isLoaded(){
  loadedDocuments += 1;
}

var populationData = new Dataset(population);
var educationData = new Dataset(education);
var employmentData = new Dataset(employment);

populationData.onload = function(){
  manageOverviewData(populationData.data)
  isLoaded();
}

educationData.onload = function(){
  isLoaded();
}

employmentData.onload = function(){
  isLoaded();
}

populationData.load();
educationData.load();
employmentData.load();
