 $(document).ready(function(){
	$('#pp').hide();

	$("#button").click(function(){
		$('body').css("background","#FF0011");
		$('h1').hide();
		$('#pp').show();
	});




	$("#bget").click(function() {
		$.get("/rest", function(data, status){
			$('#res').text("Data: " + data + " - Status: " + status);
			//alert("Data: " + data + " - Status: " + status);
		});
	});


	simpleJSON = {	"request": {
						"slice": [
							{
								"origin": "ZRH",
								"destination": "DUS",
								"date": "2014-12-02"
							}
						],
						"passengers": {
							"adultCount": 1,
							"infantInLapCount": 0,
							"infantInSeatCount": 0,
							"childCount": 0,
							"seniorCount": 0
						},
						"solutions": 20,
						"refundable": false
					}
				};


	$("#bpost").click(function() {
		console.log(simpleJSON);
		$.post(
			"/rest", 
			simpleJSON, 
			function(data, status) {$('#res').text("Data: " + data + " - Status: " + status);}
		);		
	});


	$("#bput").click(function() {
		$.ajax({
		    url: '/rest',
		    type: 'PUT',
		    success: function(result) {
		        $('#res').text("RESULT: " + result);
		    }
		});
	});


	$("#bdelete").click(function() {
		$.ajax({
		    url: '/rest',
		    type: 'DELETE',
		    success: function(result) {
		        $('#res').text("RESULT: " + result);
		    }
		});
	});
});