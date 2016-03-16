google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(display);

function display() {
    var points = [['Day', 'Total Matches']];
    points.push([matches[0].matchTime.substring(0, 10), 1]);
    var currTime = matches[0].matchTime.substring(0, 10);
    for(var i=1; i<matches.length; i++){
        if(matches[i].matchTime.substring(0, 10) == currTime){
          points[points.length - 1][1]++;
        }        
        else{
          currTime = matches[i].matchTime.substring(0, 10);
          points.push([matches[i].matchTime.substring(0, 10), 1]);
        }
    };
    var data = google.visualization.arrayToDataTable(points);

        var options = {
          curveType: 'line',
          legend: { position: 'none' },
          colors: ['#ee6545'],
      hAxis: {title: "Day"},
      vAxis: {title: "Total Matches"}
        };

    
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
