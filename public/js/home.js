(function() {
	$(document).ready(function() {
		$('[data-modal-trigger]').leanModal();

		google.charts.load("current", {
			packages: ["corechart"]
		});
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {
			var pieData = [
				['Group', 'Connections']
			];
			for (var i = 0; i < metrics.groups.length; i++) {
				var group = metrics.groups[i];
				pieData.push([group.groupName, group.totalConnections])
			}

			var data = google.visualization.arrayToDataTable(pieData);

			var options = {
				legend: 'bottom',
				title: 'Your Matching Data',
				pieHole: 0.4
			};

			var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
			if(data.length > 0){
				chart.draw(data, options);
			}
			else{
				$('#donutchart').html("You have not had a CoffeeChat yet. Scheduling a CoffeeChat is the first step in getting more connected!")
			}
		}
	});
})();