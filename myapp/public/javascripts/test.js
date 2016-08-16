 $(document).ready(function(){
	$('#pp').hide();

	$("#button").click(function(){
		$('body').css("background","#FF0011");
		$('h1').hide();
		$('#pp').show();
	});




	$("#bget").click(function() {
		$.get("http://localhost:3000/rest", function(data, status){
			$('#res').text("Data: " + data + " - Status: " + status);
			//alert("Data: " + data + " - Status: " + status);
		});
	});


	$("#bpost").click(function() {
		$.post("/rest", function(data, status){
			$('#res').text("Data: " + data + " - Status: " + status);
		});		
	});


	$("#bput").click(function() {
		$.ajax({
		    url: 'http://localhost:3000/rest',
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