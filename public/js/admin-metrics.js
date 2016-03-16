google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(main);

var totAvg = document.getElementById("totAvg");
totAvg.innerHTML = String(metrics.avgRating).substring(0,4);
var dayPoints = [['Day', 'Total Matches']];
var weekPoints = [['Week', 'Total Matches']];
var monthPoints = [['Month', 'Total Matches']];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function main() {
    dayPoints.push([matches[0].matchTime.substring(0, 10), 1]);
    weekPoints.push([matches[0].matchTime.substring(0, 10), 1]);
    var currMonth = parseInt(matches[0].matchTime.substring(5, 7)) - 1;
    monthPoints.push([months[currMonth], 1]);
    var currTime = matches[0].matchTime.substring(0, 10);
    for(var i=1; i<matches.length; i++){
        if(matches[i].matchTime.substring(0, 10) == currTime){
          dayPoints[dayPoints.length - 1][1]++;
        }        
        else{
          currTime = matches[i].matchTime.substring(0, 10);
          dayPoints.push([matches[i].matchTime.substring(0, 10), 1]);
        }
        if(parseInt(matches[i].matchTime.substring(5, 7)) - 1 == currMonth){
          monthPoints[monthPoints.length - 1][1]++;
        }
        else{
          currMonth = parseInt(matches[i].matchTime.substring(5, 7)) - 1;
          monthPoints.push([months[currMonth], 1]);
        }
    };
    displayDay();
}

function displayDay() {
    var data = google.visualization.arrayToDataTable(dayPoints);
    var options = {
          title: "Total Matches",
          curveType: 'line',
          legend: { position: 'none' },
          colors: ['#ee6545'],
      hAxis: {title: "Day"},
      vAxis: {title: "Total Matches"}
    };
    
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}

function displayWeek() {
    
    var data = google.visualization.arrayToDataTable(weekPoints);
    var options = {
          title: "Total Matches",
          curveType: 'line',
          legend: { position: 'none' },
          colors: ['#ee6545'],
      hAxis: {title: "Week"},
      vAxis: {title: "Total Matches"}
    };
    
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}

function displayMonth() {
    
    var data = google.visualization.arrayToDataTable(monthPoints);
    var options = {
          title: "Total Matches",
          curveType: 'line',
          legend: { position: 'none' },
          colors: ['#ee6545'],
      hAxis: {title: "Month"},
      vAxis: {title: "Total Matches"}
    };
    
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}
