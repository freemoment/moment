// find the ones who have umber  
// todo: add other condition: gender and isContributor
//{"longitude":116.403344,"latitude":39.926512,"limitNum":10,"specialDistance":5000,"currentUserName":"spring"}
AV.Cloud.define("queryNearByOnes", function(request, response) {
	var longitude = request.params.longitude;
	var latitude = request.params.latitude;
	var limitNum = request.params.limitNum;
	var specialDistance = request.params.specialDistance;
	var currentUserName = request.params.currentUserName;
	if(longitude==='' || !longitude || latitude==='' || !latitude ) response.error("param is null when queryUmberOnes.");
	if(limitNum==='' || !limitNum  || specialDistance==='' || !specialDistance ) response.error("param is null when queryUmberOnes.");
	if(currentUserName==='' || !currentUserName  ) response.error("currentUserName is null when queryUmberOnes.");
	// User's  currentlocation
	var userGeoPoint = new AV.GeoPoint(latitude,longitude)
	// Create a query for places
	//var Location = AV.Object.extend('Location');
	var queryLocation = new AV.Query(Location);

	// Limit what could be a lot of points.
	queryLocation.limit(limitNum);
    queryLocation.include("user");
	// Interested in locations near user.
	queryLocation.near("point", userGeoPoint);
	queryLocation.find({
		success: function(result) {
		
		  // 起点小于300的  
		  var arrayObjForStart = new Array();
		  for (var i = 0; i < result.length; i++) {
		      //读取坐标
		      var distance ="";
		      var currentPoint = result[i].get("point");
			  distance = userGeoPoint.kilometersTo(currentPoint)
			  if(distance < specialDistance){
			    //小于300的，加入集合
				arrayObjForStart.push(result[i].get("user").id);
			  }
		    }
			
			//var _User = AV.Object.extend('_User');
			var queryUser = new AV.Query(_User);
			queryUser.containedIn("objectId",arrayObjForStart);
			queryUser.include("Location");
			queryUser.include("image");
			queryUser.include("installation");
			queryUser.limit(limitNum);
			queryUser.notEqualTo("username", currentUserName);
			queryUser.find({
				success: function(resultUser) {
					//response.success(resultUser);
					//计算和每个用户的距离
					//var Relationship = AV.Object.extend('Relationship');
					
					for (var i = 0; i < resultUser.length; i++) {
					  //读取坐标
					  var distance ="";
					  var currentLocation = resultUser[i].get("Location").get("point");
					  //获取距离
					  distance = userGeoPoint.kilometersTo(currentLocation)
					  
					  resultUser[i].add("distance", distance)
					  
					}
					/////////////////////////////////
					var finalResult = {'code':200,'results':resultUser};
					response.success(finalResult);
				},
				error: function(error) {
					response.error("Error " + error.code + " : " + error.message + " when query user in xxx.");
				}
			});
		},
		error: function(error) {
		  response.error("Error " + error.code + " : " + error.message + " when queryLocation guys queryUmberOnes.");
		}
	});
});