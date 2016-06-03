google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(main);

var totAvg = document.getElementById("totAvg");
totAvg.innerHTML = String(metrics.avgRating).substring(0,4);
var dayData = [['Day', 'Sign Ups', 'Accepted Matches', 'Rejected Matches', 'Provided Feedback', 'Saved Profiles', 'Saved Surveys']];
var monthData = [['Month', 'Sign Ups', 'Accepted Matches', 'Rejected Matches', 'Provided Feedback', 'Saved Profiles', 'Saved Surveys']];
var sortDates = [];

function main() {
    for(var date in joinsDay){
      sortDates.push(parseInt(date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10)));
    }
    sortDates.sort(function(a, b){return a-b});
    for(var i = 0; i < sortDates.length; i++){
      var date = sortDates[i].toString();
      date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
      dayData.push([date.substring(5,10), joinsDay[date], acceptDay[date], rejectDay[date], feedDay[date], savepDay[date], savesDay[date]]);
    }
    sortDates = []
    for(var date in joinsMonth){
      sortDates.push(parseInt(date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10)));
    }
    sortDates.sort(function(a, b){return a-b});
    for(var i = 0; i < sortDates.length; i++){
      var date = sortDates[i].toString();
      date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
      monthData.push([date.substring(5,10), joinsMonth[date], acceptMonth[date], rejectMonth[date], feedMonth[date], savepMonth[date], savesMonth[date]]);
    }
    showJoins("day");
}

function showJoins(unit) {
  var data, options;
  if(unit == "day"){
      data = google.visualization.arrayToDataTable(dayData);
      options = {
            title: "Community Events",
            curveType: 'line',
            legend: { position: 'bottom' }
      };
  }
  else{
      data = google.visualization.arrayToDataTable(monthData);
      options = {
            title: "Community Events",
            curveType: 'line',
            legend: { position: 'bottom' }
      };
  }
  
  var chart = new google.visualization.LineChart(document.getElementById('joins_chart'));
  chart.draw(data, options);
}

