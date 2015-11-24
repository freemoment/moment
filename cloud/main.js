var Relationship = AV.Object.extend('Relationship');
var Location = AV.Object.extend('Location');
var Route = AV.Object.extend('Route');
var _User = AV.Object.extend('_User');
var Evaluation = AV.Object.extend("Evaluation");



// count of contribution  :取正在一起走的人数  done
//{"status":"3"}
// status 的状态：喜欢（1），一起走（3），结束（2）, 评价（4）
AV.Cloud.define("getRelationCountByStatus", function(request, response) {
  query = new AV.Query(Relationship);
  query.equalTo("isActive", true);
  query.equalTo("status", request.params.status);
  query.count({
    success: function(count) {
		var finalResult = {'code':200,'results':count};
		response.success(finalResult);
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys getRelationCountByStatus.");
    }
  });
});





// 发一个喜欢请求  done, A -> B :1
// {"userId":"spring","toUserId":"girl"}    done
AV.Cloud.define("requestToSomeone", function(request, response) {
    // 当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

	if(fromUserId==='' || toUserId==='' || !fromUserId || !toUserId ) response.error("param is null when query guys requestToSomeone.");

    query = new AV.Query(Relationship);
    query.equalTo("fromUser", fromUserId);
    query.equalTo("toUser", toUserId);
  
    query.first({
    success: function(result) {
        // not exist, create and save;  
        if(!result){
            var relationship = new Relationship();

            relationship.set("fromUser",fromUserId);
            relationship.set("toUser",toUserId);
            relationship.set("isActive",true);
            relationship.set("status",1);
            relationship.save(null, {
            success: function(relationship) {
				var finalResult = {'code':200,'results':relationship};
				response.success(finalResult);
			    
              },
              error: function(relationship, error) {
                response.error("Error " + error.code + " : " + error.messag + " when save.");
              }
            });
        }else{
		  
          // or update
          result.set("isActive",true);
		  result.set("status",1);
          result.save(null, {
              success: function(result) {
			    var finalResult = {'code':200,'results':result};
				response.success(finalResult);
				////
              },
              error: function(result, error) {
                response.error("Error " + error.code + " : " + error.message + " when update.");
              }
            });
        }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query relationship.");
    }
  });


});


// set status  B -> A，eg:3 to 4 ,
//{"userId":"spring","toUserId":"elppa","originalStatus":3,"goalStatus":4}   done

AV.Cloud.define("setStatusForPerformance", function(request, response) {

    // 当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;
	// 状态获取
    var originalStatus = request.params.originalStatus;
    var goalStatus = request.params.goalStatus;
	
	if(fromUserId==='' || toUserId==='' || !fromUserId || !toUserId ) response.error("userId is null when query guys setStatusForPerformance.");
	if(originalStatus==='' || goalStatus==='' || !originalStatus || !goalStatus ) response.error("status is null when query guys setStatusForPerformance.");

    query = new AV.Query(Relationship);
    query.equalTo("fromUser", fromUserId);
    query.equalTo("toUser", toUserId);
    query.equalTo("status", originalStatus);
    query.equalTo("isActive", true);
	
    query.first({
    success: function(result) {
        // not exist, create and save;  
        if(!result){
            var finalResult = {'code':200,'results':true};
			response.success(finalResult);

        }else{
          // or update
		  result.set("status",goalStatus);
          result.save(null, {
              success: function(result) {
			    
				queryReverse = new AV.Query(Relationship);
				queryReverse.equalTo("fromUser", toUserId);
				queryReverse.equalTo("toUser", fromUserId);
				queryReverse.equalTo("status", originalStatus);
				queryReverse.equalTo("isActive", true);
				queryReverse.first({
					success: function(resultdata) {
					    // not exist
					    if(!resultdata){
							
							var finalResult = {'code':200,'results':true};
							response.success(finalResult);
							
						}else{
						    resultdata.set("status",goalStatus);
							////////////////
							resultdata.save(null, {
							  success: function(result) {
								var finalResult = {'code':200,'results':result};
								response.success(finalResult);
									
							  },
							  error: function(result, error) {
								response.error("Error " + error.code + " : " + error.message + " when setStatusForPerformance update.");
							  }
							});
						}
					    
					},
					error: function(error) {
					  response.error("Error " + error.code + " : " + error.message + " when queryReverse  setStatusForPerformance.");
					}
				});
				
              },
              error: function(result, error) {
                response.error("Error " + error.code + " : " + error.message + " when update status setStatusForPerformance.");
              }
            });
        }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when main query setStatusForPerformance.");
    }
  });

});



// agree a request   
//  {"userId":"lee","toUserId":"spring"}
AV.Cloud.define("agreeRequest", function(request, response) {
    	//当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

	if(fromUserId==='' || toUserId==='' || !fromUserId || !toUserId ) response.error("param is null when agreeRequest.");
    
	var query = new AV.Query("Relationship");

    query.equalTo("fromUser",fromUserId);
    query.equalTo("toUser",toUserId);
	
	var revertQuery = new AV.Query("Relationship");
	revertQuery.equalTo("fromUser",toUserId);
    revertQuery.equalTo("toUser",fromUserId);
	
	var mainQueryForAgree = AV.Query.or(query, revertQuery);
	
	mainQueryForAgree.find({
	    success: function(result) {
		    //提取 result的数据，组成数组
			for (var i = 0; i < result.length; i++) {
				result[i].set("status",3);
			}
		    AV.Object.saveAll(result, {
			    success: function(list) {
			      console.log(list);
					//fromUser relation update
					var fromIdQuery = new AV.Query("Relationship");
					fromIdQuery.equalTo("fromUser",fromUserId);
					fromIdQuery.notEqualTo("toUser", toUserId);
					
					var toIdQuery = new AV.Query("Relationship");
					toIdQuery.equalTo("toUser",fromUserId);
					toIdQuery.notEqualTo("fromUser", toUserId);
					
					var mainQuery = AV.Query.or(fromIdQuery, toIdQuery);
					mainQuery.find({
						  success: function(results) {
							for (var i = 0; i < results.length; i++) {
								results[i].set("status",2);
							}
							AV.Object.saveAll(results, {
							    success: function(listFromUser) {
									//response.success(listFromUser);
									var fromIdQuery1 = new AV.Query("Relationship");
									
									//toUser relation update
									fromIdQuery1.equalTo("fromUser",toUserId);
									fromIdQuery1.notEqualTo("toUser", fromUserId);
									
									var toIdQuery1 = new AV.Query("Relationship");
									toIdQuery1.equalTo("toUser",toUserId);
									toIdQuery1.notEqualTo("fromUser", fromUserId);
									
									var mainQuery1 = AV.Query.or(fromIdQuery1, toIdQuery1);
									mainQuery1.find({
									  success: function(results) {
										for (var i = 0; i < results.length; i++) {
											results[i].set("status",2);
										}
										AV.Object.saveAll(results, {
										    success: function(listToUser) {
												var finalResult = {'code':200,'results':'success'};
												response.success(finalResult);
										    },
										    error: function(error) {
										      // An error occurred while saving one of the objects.
											  response.error("Error " + error.code + " : " + error.message + " when saveAll.");
										    },
										});
									  },
									  error: function(error) {
										response.error("Error " + error.code + " : " + error.message + " when find.");
									  }
									});
							    },
							    error: function(error) {
							      // An error occurred while saving one of the objects.
									response.error("Error " + error.code + " : " + error.message + " when saveAll.");
							    },
							});
						  },
						  error: function(error) {
							response.error("Error " + error.code + " : " + error.message + " when find.");
						  }
					});
					////////////////////////
			    },
			    error: function(error) {
			      // An error occurred while saving one of the objects.
				  response.error("Error " + error.code + " : " + error.message + " when saveAll.");
			    },
			  });
	    },
	    error: function(error) {
	      response.error("Error " + error.code + " : " + error.message + " when mainQueryForAgree.find.");
	    }
  });
});



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


// find the ones who dont have umber 
// todo: implement again
AV.Cloud.define("queryNoUmberOnes", function(request, response) {
  //var User = AV.Object.extend('User');
  query = new AV.Query(_User);
  query.find({
    success: function(result) {
        var finalResult = {'code':200,'results':result};
		response.success(finalResult);
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys queryUmberOnes.");
    }
  });
})



// find the ones who request yourself 
//{"userId":"spring","offset":0,"count":10,"longitude":116.403344,"latitude":39.926512}
AV.Cloud.define("queryRequestToMeList", function(request, response) {
	var toUserId = request.params.userId;
	 
	 var offset = request.params.offset;
	 var count = request.params.count;
	 var longitude = request.params.longitude;
	 var latitude = request.params.latitude;
	 
	 if(longitude==='' || !longitude || latitude==='' || !latitude) response.error("param is null when queryRequestToMeList.");
	 if(toUserId==='' || !toUserId ) response.error("param is null when queryRequestToMeList.");
	 
	 var userGeoPoint = new AV.GeoPoint(latitude,longitude)
	 AV.Query.doCloudQuery('select include Location,* from _User where username = (select fromUser from Relationship where toUser=? and status=1 limit ?,?)',[toUserId,offset,count],
		 {
		  success: function(result){
			 var queryResult = result.results;
			 for (var i = 0; i < queryResult.length; i++) {
			      queryResult[i].set('Location', queryResult[i].get('Location').toJSON());
			 }
			 
			 //response.success(queryResult);
			 //计算和每个用户的距离
			for (var i = 0; i < queryResult.length; i++) {
			  //读取坐标
			  var distance ="";
			  //console.log(queryResult[i].get('Location'));
			  if(queryResult[i]){
			      
				  var currentLocation = queryResult[i].get('Location').point;
				  console.log(currentLocation);
				  
				  //获取距离
				  distance = userGeoPoint.kilometersTo(currentLocation)
				  
				  queryResult[i].add("distance", distance)
			  }
			}
			var finalResult = {'code':200,'results':queryResult};
			response.success(finalResult);
			
		  },
		  error: function(error){
			//查询失败，查看 error
			console.dir(error);
		  }
		});
})


// find the ones who I sent request 
//  {"userId":"spring"}
AV.Cloud.define("queryMyRequestList", function(request, response) {
 var fromUserId = request.params.userId;
 //var fromUserId = AV.User.current().get("objectId");
 if(fromUserId==='' || !fromUserId ) response.error("param is null when queryMyRequestList.");
 AV.Query.doCloudQuery('select * from _User where username = (select toUser from Relationship where fromUser=? and status=1 )',[fromUserId],
 {
  success: function(result){
     var finalResult = {'code':200,'results':result};
	 response.success(finalResult);
  },
  error: function(error){
    //查询失败，查看 error
    console.dir(error);
  }
});
})







// regester
//   {"phone":"18058167549","username":"u_spring","password":"1234","gender":"1"}
AV.Cloud.define("regesterOnline", function(request, response) {
	var phone = request.params.phone;
	var username = request.params.username;
	var password = request.params.password;
	var gender = request.params.gender;

	if(phone==='' || !phone  ||username==='' || !username ||password==='' || !password ||gender==='' || !gender ) response.error("param is null when register.");
	
	;
    query = new AV.Query(_User);
    query.equalTo("mobilePhoneNumber", phone);
	query.equalTo("regester_status", false);
  
    query.first({
		success: function(result) {
		    //update
			result.set("mobilePhoneNumber",phone);
			result.set("username",username);
			result.set("password",password);
			result.set("gender",gender);
			result.set("regester_status",true);
			result.save(null, {
			  success: function(user) {
				var file = AV.File.withURL('test.jpg', 'http://www.baidu.com/img/chrismaspc_552d5d36d6cd8ed48174902600cb2b4b.gif');
				
				file.save().then(function(restult) {
				  // the object was saved successfully.
					
					user.set("image",restult);
					//query.first
					user.save(null,{
					  success: function(results) {
						  var finalResult = {'code':200,'results':results};
						  response.success(finalResult);
					  },
					  error: function(error) {
						response.error("Error ");
					  }
					});
				 
				}, function(error) {
				  // the save failed.
				  response.error("Error ");
				});

			  },
			  error: function(user, error) {
				response.error("Error " + error.code + " : " + error.message + " when regester update.");
			  }
			});
		},
		error: function(error) {
		  response.error("Error " + error.code + " : " + error.message + " when regester query user");
		}
	});

})


// regester
//   {"phone":"18058167549","username":"u_spring","password":"1234","gender":"1"}
AV.Cloud.define("regesterOnlinebak", function(request, response) {
	var phone = request.params.phone;
	var username = request.params.username;
	var password = request.params.password;
	var gender = request.params.gender;

	if(phone==='' || !phone ||username==='' || !username ||password==='' || !password ||gender==='' || !gender) response.error("param is null when register.");
	
	;
    query = new AV.Query(_User);
    query.equalTo("mobilePhoneNumber", phone);
	query.equalTo("regester_status", false);
  
    query.first({
		success: function(result) {
		    //update
			result.set("mobilePhoneNumber",phone);
			result.set("username",username);
			result.set("password",password);
			result.set("gender",gender);
			result.set("regester_status",true);
			result.save(null, {
			  success: function(user) {
			    //save pic
				var fileUploadControl = $("#profilePhotoFileUpload")[0];
				if (fileUploadControl.files.length > 0) {
					var file = fileUploadControl.files[0];
					var name = "photo.jpg";

					var avFile = new AV.File(name, file);
				
					avFile.save().then(function(restult) {
						// the file object was saved successfully. then set to user
						user.set("image",restult);
						//query.first
						user.save(null,{
						  success: function(results) {
							  var finalResult = {'code':200,'results':results};
							  response.success(finalResult);
						  },
						  error: function(error) {
							response.error("Error ");
						  }
						});
					 
					}, function(error) {
					  // the save failed.
					  response.error("Error ");
					});
				}

			  },
			  error: function(user, error) {
				response.error("Error " + error.code + " : " + error.message + " when regester update.");
			  }
			});
		},
		error: function(error) {
		  response.error("Error " + error.code + " : " + error.message + " when regester query user");
		}
	});

})




//login
//{"phone":"18055554123","password":"123"}
AV.Cloud.define("login", function(request, response) {

	 var phone = request.params.phone;
	  var password = request.params.password;

	  if(phone==='' || password==='' || !phone || !password) response.error("param is null when login.");
		

	  AV.User.logInWithMobilePhone(phone, password).then(function(user){
		 var finalResult = {'code':200,'results':user};
	     response.success(finalResult);
	  }, function(err){
		 response.error("faile");
	  });

})




//sendVerifyCode
//{"phone":"18058167549"}
AV.Cloud.define("sendVerifyCode", function(request, response) {

	 var phone = request.params.phone;
	 var password = request.params.password;
	 if(phone==='' || !phone  ||password==='' || !password ) response.error("param is null when query guys sendVerifyCode.");
	  //发送验证之前，存手机号
		//var _User = AV.Object.extend("_User");
		var userQuery = new _User();

		var username = "u"+ phone;
		userQuery.set("mobilePhoneNumber",phone);
		userQuery.set("username",username);
		userQuery.set("password",password);
		userQuery.save(null, {
		  success: function(user) {
			AV.User.requestMobilePhoneVerify(phone).then(function(){
			//发送成功
			   var finalResult = {'code':200,'results':'success'};
			   response.success(finalResult);
			}, function(err){
			   //发送失败
			   response.success(err);
			});
		  },
		  error: function(user, error) {
			response.error("Error " + error.code + " : " + error.message + "in sendVerifyCode when save.");
		  }
		});
})



//handleVerifyCode
//{"code":"883769"}
AV.Cloud.define("handleVerifyCode", function(request, response) {
     var code = request.params.code;
	 if(code==='' || !code ) response.error("param is null when query guys handleVerifyCode.");

	  AV.User.verifyMobilePhone(code).then(function(){
        //验证成功
		var finalResult = {'code':200,'results':'success'};
	    response.success(finalResult);
    }, function(err){
       //验证失败
	   response.success(err);
    });

})



//logout
//{"userId":"54903e39e4b0e5bf1286f33c"}
AV.Cloud.define("logOut", function(request, response) {
     //当前用户id
    var userId = request.params.userId;

	if(userId==='' || !userId  ) response.error("param is null when query logOut.");
    ;
    query = new AV.Query(_User);
    query.equalTo("objectId", userId);
  
    query.first({
    success: function(result) {
       //update
	  var online = request.params.online;
	 
	  result.set("online",false);
	  result.save(null, {
		  success: function(result) {
		  //logout
		  AV.User.logOut();
		  var finalResult = {'code':200,'results':'success'};
	      response.success(finalResult);

		  },
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when find user for logout");
    }
  });
     
})



//list detail
//{"userId":"spring"}
AV.Cloud.define("showDetail", function(request, response) {
	 
	 //当前用户id
	var _User = AV.Object.extend('_User');
    var userId = request.params.userId;

	if(userId==='' || !userId ) response.error("param is null when query showDetail.");

    query = new AV.Query(_User);
    query.equalTo("username", userId);
    query.include("evaluation");
    query.first({
    success: function(result) {
       if(result.get('evaluation')){
           result.set('evaluation', result.get('evaluation').toJSON());
           var finalResult = {'code':200,'results':result};
    	   response.success(finalResult);
       }else{
           var finalResult = {'code':200,'results':result};
    	   response.success(finalResult);
       }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query showDetail");
    }
  });
})



//update my detail
//{"userId":"54a2c310e4b06eb20392b984","username":"boy77","password":"456","gender":"0","signature":"fuck me"}
AV.Cloud.define("updateMyDetail", function(request, response) {
	 
	 //当前用户id
    var userId = request.params.userId;

	if(userId==='' || !userId ) response.error("param is null when query showDetail.");
    ;
    query = new AV.Query(_User);
    query.equalTo("objectId", userId);
  
    query.first({
    success: function(result) {
       //update
	  var username = request.params.username;
	  var password = request.params.password;
	  var gender = request.params.gender;
	  var signature = request.params.signature;
	  
	  result.set("username",username);
	  result.set("password",password);
	  result.set("gender",gender);
	  result.set("signature",signature);
	  result.save(null, {
		  success: function(result) {
		   var finalResult = {'code':200,'results':'success'};
	       response.success(finalResult);

		  },
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when updateMyDetail");
    }
  });
})



//checkUserName
//{"username":"kitty"}
AV.Cloud.define("checkUserName", function(request, response) {
	 
	var username = request.params.username;

	if(username==='' || !username ) response.error("param is null when checkUserName.");

	//var _User = AV.Object.extend("_User");
	var userQuery = new AV.Query(_User);

	userQuery.equalTo("username",username);

	userQuery.count( {
	  success: function(user) {
	       var finalResult = {'code':200,'results':user};
	       response.success(finalResult);
	  },
	  error: function(user, error) {
		response.error("Error " + error.code + " : " + error.message + " when save.");
	  }
	});
	 
})



// save start location in Route
// {"username":"elppa","startLatitude":3,"startLongitude":3}
AV.Cloud.define("saveRoute", function(request, response) {
    //当前用户id
  var username = request.params.username;
  // start
  var startLatitude = request.params.startLatitude;
  var startLongitude = request.params.startLongitude;
    
  if(startLatitude==='' || !startLatitude ) response.error("startLatitude is null ");
  if(startLongitude==='' || !startLongitude ) response.error("startLongitude is null ");
  if(username==='' || !username ) response.error("username is null ");
    
  var point = new AV.GeoPoint(startLatitude, startLongitude);
  query = new AV.Query("Route");
  
    //var _User = AV.Object.extend("_User");
    user = new AV.Query("_User");

    user.equalTo("username",username);
    user.first( {
    success: function(user) {
           //if user not nul
           if (user) {
		       
               var route = new Route();
			   route.set("start", point);
			   route.set("user",user);
			   route.set("userId",user.id);
			   route.save(null, {
				success: function(result) {
				
				var finalResult = {'code':200,'results':result};
				response.success(finalResult);
				
				},
				error: function(result, error) {
				response.error("Error " + error.code + " : " + error.message + " when save saveRoute.");
				}
			  });
           }else{
			var finalResult = {'code':200,'results':'done'};
			response.success(finalResult);
		   }
    },
    error: function(user, error) {
    response.error("Error " + error.code + " : " + error.message + " when user find.");
    }
  });
});




// save location
// {"username":"kitty","latitude":1,"longitude":1}
AV.Cloud.define("saveCurrentAddress", function(request, response) {
    //当前用户id
    var username = request.params.username;
	// start
	var latitude = request.params.latitude;
	var longitude = request.params.longitude;
    
	if(latitude==='' || !latitude  ) response.error("latitude is null ");
	if(longitude==='' || !longitude ) response.error("longitude is null ");
	if(username==='' || !username ) response.error("username is null ");
    
    var point = new AV.GeoPoint(latitude, longitude);
	//var Location = AV.Object.extend("Location");
    query = new AV.Query("Location");
	
	//var _User = AV.Object.extend("_User");
    user = new AV.Query("_User");

    user.equalTo("username",username);
	user.first( {
	  success: function(user) {
			//response.success(user.id);
           if (user) {
           	AV.Query.doCloudQuery('select * from Location where user= pointer(\'_User\',?)',[user.id],
			{
			  success: function(result){
		         //not exist, insert;  
				 var queryResult = result.results[0];
				if(!queryResult){
				    //response.success("1");
					//var Location = AV.Object.extend("Location");
					var location = new Location();
					location.set("point", point);
					
					 location.set("user",user);
					 location.save(null, {
					  success: function(result) {
						//user set location
						user.set("Location",result)
						user.save(null, {
						  success: function(userResult) {
							
							var finalResult = {'code':200,'results':userResult};
							response.success(finalResult);
						  },
						  error: function(result, error) {
							response.error("Error " + error.code + " : " + error.message + " when save user location");
						  }
						});
						
					  },
					  error: function(result, error) {
						response.error("Error " + error.code + " : " + error.message + " when save.");
					  }
					});
				}else{
				    //or update
					//response.success("2");
					queryResult.set("point", point);
				    queryResult.save(null, {
					  success: function(result) {
						//user set location
						user.set("Location",result)
						user.save(null, {
						  success: function(userResult) {
							
							var finalResult = {'code':200,'results':userResult};
							response.success(finalResult);
						  },
						  error: function(result, error) {
							response.error("Error " + error.code + " : " + error.message + " when save user location");
						  }
						});
						
					  },
					  error: function(result, error) {
						response.error("Error " + error.code + " : " + error.message + " when update.");
					  }
					});
				}
			  },
			  error: function(error){
				//查询失败，查看 error
				response.error("Error " + error.code + " : " + error.message + " when query guys saveCurrentAddress.");
			  }
			  
			});


           }
	  },
	  error: function(user, error) {
		response.error("Error " + error.code + " : " + error.message + " when user find.");
	  }
	});

});



// save current location
// {"username":"kitty","isContributor":true}
AV.Cloud.define("switchIsContributor", function(request, response) {
  var username = request.params.username;
  var isContributor = request.params.isContributor;
  if(isContributor==='' || !isContributor ) response.error("isContributor is null ");
  if(username==='' || !username ) response.error("username is null ");

  //var _User = AV.Object.extend("_User");
  query = new AV.Query("_User");
  query.equalTo("username",username);
  query.first({
	  success: function(result) {
	    // or update
		result.set("isContributor", isContributor);
		result.save(null, {
		  success: function(userResult) {
			var finalResult = {'code':200,'results':userResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
	      
	  },
	  error: function(error) {
	    response.error("Error ");
	  }
	});
});

// 挂断状态:false,激活：true
// {"fromUser":"lee","toUser":"spring","isActive":false}
AV.Cloud.define("changeRelation", function(request, response) {
	var fromUser = request.params.fromUser;
    var toUser = request.params.toUser;
	var isActive = request.params.isActive;
	
	  if(fromUser==='' || !fromUser ) response.error("fromUser is null ");
	  if(toUser==='' || !toUser  ) response.error("toUser is null ");
	  if(isActive==='' || !isActive  ) response.error("isActive is null ");
	  
	  ;
	  query = new AV.Query(Relationship);
	  query.equalTo("fromUser",fromUser);
	  query.equalTo("toUser",toUser);
	  
	  query.first({
		success: function(result) {
			if(result){
				result.set("isActive", isActive);
				result.save(null, {
				  success: function(result) {
					var finalResult = {'code':200,'results':result};
					response.success(finalResult);
					},
				  error: function(result, error) {
					response.error("Error " + error.code + " : " + error.message + " when update.");
				  }
				});
			}

		},
		error: function(error) {
		  response.error("Error " + error.code + " : " + error.message + " when query relation finishRelation.");
		}
	  });
});



// {"currentUserName":"elppa"}
AV.Cloud.define("queryAgreeRelationShip", function(request, response) {
	var currentUserName = request.params.currentUserName;

	if(currentUserName==='' ||  !currentUserName ) response.error("param is null when query agreeRequest list.");
	query = new AV.Query(Relationship);
	query.equalTo("toUser",currentUserName);
	query.equalTo("status",3);
	query.equalTo("isActive",true);
	query.first({
		success: function(relationResult) {
			if(relationResult){
				var finalResult = {'code':200,'results':relationResult};
				response.success(finalResult);
			}else{
				var finalResult = {'code':200,'results':relationResult};
				response.success(finalResult);
			}
		},
		error: function(error) {
		  response.error("Error " + error.code + " : " + error.message + " when query agree relation .");
		}
});
		
});

//////done



// "honesty"  evaluate
AV.Cloud.define("evaluateHonesty", function(request, response) {
	 
	;
    query = new AV.Query("Evaluation");

	query.find({
	  success: function(results) {
		  results[0].increment("honesty",1);
		  results[0].save(null, {
		  success: function(evaluateResult) {
			var finalResult = {'code':200,'results':evaluateResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
		
	  },
	  error: function(error) {
		response.error("Error ");
	  }
	});
});


// "safety" evaluate
AV.Cloud.define("evaluateSafety", function(request, response) {
	 
	;
    query = new AV.Query("Evaluation");

	query.find({
	  success: function(results) {
		  results[0].increment("safety",1);
		  results[0].save(null, {
		  success: function(evaluateResult) {
			var finalResult = {'code':200,'results':evaluateResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
		
	  },
	  error: function(error) {
		response.error("Error ");
	  }
	});
});


// "humor"  evaluate
AV.Cloud.define("evaluateHumor", function(request, response) {
	 
	;
    query = new AV.Query("Evaluation");

	query.find({
	  success: function(results) {
		  results[0].increment("humor",1);
		  results[0].save(null, {
		  success: function(evaluateResult) {
			var finalResult = {'code':200,'results':evaluateResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
		
	  },
	  error: function(error) {
		response.error("Error ");
	  }
	});
});

// "awesomeLook"  evaluate
AV.Cloud.define("evaluateAwesomeLook", function(request, response) {
	 
	;
    query = new AV.Query("Evaluation");

	query.find({
	  success: function(results) {
		  results[0].increment("awesomeLook",1);
		  results[0].save(null, {
		  success: function(evaluateResult) {
			var finalResult = {'code':200,'results':evaluateResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
		
	  },
	  error: function(error) {
		response.error("Error ");
	  }
	});
});


// "asshole"  evaluate
AV.Cloud.define("evaluateAsshole", function(request, response) {
	 
	;
    query = new AV.Query("Evaluation");

	query.find({
	  success: function(results) {
		  results[0].increment("asshole",1);
		  results[0].save(null, {
		  success: function(evaluateResult) {
			var finalResult = {'code':200,'results':evaluateResult};
		    response.success(finalResult);
			},
		  error: function(result, error) {
			response.error("Error " + error.code + " : " + error.message + " when update.");
		  }
		});
		
	  },
	  error: function(error) {
		response.error("Error ");
	  }
	});
});