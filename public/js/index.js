(function() {
	$(document).ready(function() {
		$('.parallax').parallax();
		$('[data-modal-trigger]').leanModal();
	});

	google.charts.load("current", {
		packages: ["corechart"]
	});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var pieData = [['Group', 'Connections']];
		for (var i = 0; i < metrics.groups.length; i++) {
			var group = metrics.groups[i];
			pieData.push([group.groupName, group.totalConnections])
		}

		console.log(pieData);

		var data = google.visualization.arrayToDataTable(pieData);

		var options = {
			legend: 'bottom',
			title: 'Your charts',
			pieHole: 0.4
		};

		var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
		chart.draw(data, options);
	}

	 $('[data-submit]').click(function(e) {
            $.ajax({
                url: "/wild/user/login",
                method: "POST",
                data: {
					email: $('#email').val(),
					password: $('#password').val()
                },
                success: function(data) {
                    console.log(data);
                }
            });
            $('#code').html('Please enter a valid company code');
        });
})();