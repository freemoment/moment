// todo: implement again
AV.Cloud.define("queryUmberOnes", function(request, response) {
    var longitude = request.params.longitude;
	var latitude = request.params.latitude;
	if(longitude==='' || longitude === null || latitude==='' || latitude === null ) response.error("param is null when queryUmberOnes.");
	// User's location
	var userGeoPoint = new AV.GeoPoint(latitude,longitude)
	// Create a query for places
	var Location = AV.Object.extend('Location');
	var queryLocation = new AV.Query("Location");

	// Limit what could be a lot of points.
	queryLocation.limit(50);

	// Interested in locations near user.
	queryLocation.near("point", userGeoPoint);
	queryLocation.find({
	success: function(result) {
	  // 起点小于300的
	  var arrayObjForStart = new Array([50])
	  for (var i = 0; i < result.length; i++) {
      response.success(result[0].get("user").get("objectId"));
    }
	  response.success(result);
	},
	error: function(error) {
	  response.error("Error " + error.code + " : " + error.message + " when queryLocation guys queryUmberOnes.");
	}
	});
});