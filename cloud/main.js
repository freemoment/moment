
// count of contribution  :取正在共伞的数量  done
//{"status":"3"}
// status 的状态：1	请求，2	拒绝，3	接受，7	暗恋
AV.Cloud.define("getRelationCountByStatus", function(request, response) {
  var Relationship = AV.Object.extend('Relationship');
  query = new AV.Query(Relationship);
  query.equalTo("isActive", true);
  query.equalTo("status", request.params.status);
  query.count({
    success: function(count) {
  
        response.success(count);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys getRelationCountByStatus.");
    }
  });
});





// 发一个请求  done, 
// {"userId":"spring","toUserId":"girl"}
AV.Cloud.define("requestToSomeone", function(request, response) {
    // 当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

	if(fromUserId==='' || toUserId==='' || fromUserId === null || toUserId===null) response.error("param is null when query guys requestToSomeone.");
    var Relationship = AV.Object.extend('Relationship');
    query = new AV.Query(Relationship);
    query.equalTo("fromUser", fromUserId);
    query.equalTo("toUser", toUserId);
    query.equalTo("status", 1);
  
    query.first({
    success: function(result) {
        // already exist, do nothing;  
        if(!result){
            var relationship = new Relationship();

            relationship.set("fromUser",fromUserId);
            relationship.set("toUser",toUserId);
            relationship.set("isActive",true);
            relationship.set("status",1);
             relationship.save(null, {
              success: function(relationship) {
                var finalResult = {'code':200,'results':success};
				response.success(finalResult);

              },
              error: function(relationship, error) {
                response.error("Error " + error.code + " : " + error.message + " when save.");
              }
            });
        }else{
		  
          // or update
          result.set("isActive",true);
          result.save(null, {
              success: function(result) {
                response.success("success");

              },
              error: function(result, error) {
                response.error("Error " + error.code + " : " + error.message + " when update.");
              }
            });
        }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys InOneUmberCount.");
    }
  });

});


// 取消一个请求  done  {"userId":"spring","toUserId":"girl"}
AV.Cloud.define("cancelRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

	if(fromUserId==='' || toUserId==='' || fromUserId === null || toUserId===null) response.error("param is null when query cancelRequest.");
    // var fromUserId = "testone11";
    // var toUserId = "testtwo1";

    var Relationship = AV.Object.extend("Relationship");
    query = new AV.Query("Relationship");

    query.equalTo("fromUser",fromUserId);
    query.equalTo("toUser",toUserId);
    query.equalTo("isActive",true);
    query.equalTo("status",1);
    query.first({
      success: function(result) {
                 if (result) {
                    result.destroy({
                    success: function(result) {
                    // The object was deleted from the AV Cloud.
                    response.success("success");
                  },
                  error: function(result, error) {
                    // The delete failed.
                    // error is a AV.Error with an error code and description.
                    response.error(error);
                  }
                });
                 }
               response.success("success");
      },
      error: function(result, error) {
        response.error('Failed to find object before destroy, with error code: ' + error.message);
      }
    });
});







// 拒绝一个请求  done
AV.Cloud.define("rejectRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;
	if(fromUserId==='' || toUserId==='' || fromUserId === null || toUserId===null) response.error("param is null when rejectRequest.");
    // var fromUserId = "testone11";
    // var toUserId = "testtwo1";
	
	var Relationship = AV.Object.extend("Relationship");
    query = new AV.Query("Relationship");

    query.equalTo("fromUser",fromUserId);
    query.equalTo("toUser",toUserId);
    query.equalTo("status",1);
    
	query.first({
    success: function(result) {
        //already exist, do nothing;  
        if(!result){
            var Relationship = AV.Object.extend("Relationship");
		    var relationship = new Relationship();

		    relationship.set("fromUser",fromUserId);
		    relationship.set("toUser",toUserId);
		    relationship.set("isActive",false);
		    relationship.set("status",2);
             relationship.save(null, {
              success: function(relationship) {
                response.success("success");

              },
              error: function(relationship, error) {
                response.error("Error " + error.code + " : " + error.message + " when save.");
              }
            });
        }else{
		  
          //or update
          result.set("isActive",false);
		  result.set("status",2);
          result.save(null, {
              success: function(result) {
                response.success("success");

              },
              error: function(result, error) {
                response.error("Error " + error.code + " : " + error.message + " when update.");
              }
            });
        }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys InOneUmberCount.");
    }
  });

});



// 可以修改目的地  done  {"userObjectId":"5492e9f6e4b0bf53d4dbc1fb","latitude":1,"longitude":1}
AV.Cloud.define("modifyEndLocation", function(request, response) {
     //当前用户id
    //var fromUserObjectId = request.params.userObjectId;
	var fromUserObjectId = AV.User.current().get("objectId");
	//目的地
    var latitude = request.params.latitude;
	var longitude = request.params.longitude;
	if(fromUserObjectId==='' || latitude==='' ||longitude===''|| fromUserObjectId === null || latitude===null || longitude===null) response.error("param is null when modifyEndLocation.");
    
    //var Route = AV.Object.extend("Route");
    //query = new AV.Query("Route");
    
    //query.find({
	AV.Query.doCloudQuery('select * from Route where user= pointer(\'_User\',?)',[fromUserObjectId],
	{
	  success: function(results){
         
		 var point = new AV.GeoPoint(latitude, longitude);
		 results.results[0].set("end", point);
		 results.results[0].save(null, {
              success: function(results) {
              response.success(results);

              },
              error: function(results, error) {
                response.error("Error " + error.code + " : " + error.message + " when update.");
              }
            });
	  },
	  error: function(error){
		//查询失败，查看 error
		console.dir(error);
	  }
	});

});







// agree a request   
//  {"userId":"lee","toUserId":"spring"}
AV.Cloud.define("agreeRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

	if(fromUserId==='' || toUserId==='' || fromUserId === null || toUserId===null) response.error("param is null when agreeRequest.");
    // var fromUserId = "testone11";
    // var toUserId = "testtwo1";

    var Relationship = AV.Object.extend("Relationship");
	query = new AV.Query("Relationship");

    query.equalTo("fromUser",fromUserId);
    query.equalTo("toUser",toUserId);
	
	query.first({
    success: function(result) {
        //already exist 
        if(result){
          // update
          result.set("isActive",true);
		  result.set("status",3);
          result.save(null, {
              success: function(result) {
                response.success("success");

              },
              error: function(result, error) {
                response.error("Error " + error.code + " : " + error.message + " when update.");
              }
            });
        }
    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys InOneUmberCount.");
    }
  });

});



// find the ones who have umber  
// todo: implement again
AV.Cloud.define("queryUmberOnes", function(request, response) {
	var longitude = request.params.longitude;
	var latitude = request.params.latitude;
	if(longitude==='' || longitude === null || latitude==='' || latitude === null ) response.error("param is null when queryUmberOnes.");
	// User's  currentlocation
	var userGeoPoint = new AV.GeoPoint(latitude,longitude)
	// Create a query for places
	var Location = AV.Object.extend('Location');
	var queryLocation = new AV.Query(Location);

	// Limit what could be a lot of points.
	queryLocation.limit(50);
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
			  if(distance < 300){
			    //小于300的，加入集合
				arrayObjForStart.push(result[i].get("user").id);
			  }
		    }
			var Route = AV.Object.extend('Route');
			var queryRoute = new AV.Query(Route);
			queryRoute.containedIn("userId",arrayObjForStart);
			queryRoute.find({
				success: function(resultRoute) {
				     // 终点小于300的  
					 var arrayObjForEnd = new Array();
					  for (var i = 0; i < resultRoute.length; i++) {
					      //读取坐标
					      var distance ="";
					      var endPoint = resultRoute[i].get("end");
						  distance = userGeoPoint.kilometersTo(endPoint)
						  if(distance < 300){
						  //小于300的，加入集合
						  arrayObjForEnd.push(resultRoute[i].get("userId"));
						  }
					    }
					
					var _User = AV.Object.extend('_User');
					var queryUser = new AV.Query(_User);
					queryUser.containedIn("objectId",arrayObjForEnd);
					queryUser.include("Location");
					queryUser.include("image");
					queryUser.include("installation");
					queryUser.limit(20);
					queryUser.find({
						success: function(resultUser) {
						    //计算和每个用户的距离
							for (var i = 0; i < resultUser.length; i++) {
							  //读取坐标
							  var distance ="";
							  var currentLocation = resultUser[i].get("Location").get("point");
							  //获取距离
							  distance = userGeoPoint.kilometersTo(currentLocation)
							  
							  resultUser[i].add("distance", distance)
							  
							}
							var finalResult = {'code':200,'results':resultUser};
							response.success(finalResult);
						},
						error: function(error) {
							response.error("Error " + error.code + " : " + error.message + " when query user in xxx.");
						}
					});
				},
				error: function(error) {
					response.error("Error " + error.code + " : " + error.message + " when query Route in xxx.");
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
  var User = AV.Object.extend('User');
  query = new AV.Query(User);
  query.find({
    success: function(result) {
        response.success(result);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys queryUmberOnes.");
    }
  });
})



// find the ones who request yourself 
//{"userId":"spring","offset":0,"count":1}
AV.Cloud.define("queryRequestToMeList", function(request, response) {
 //var toUserId = request.params.userId;
 var toUserId = AV.User.current().get("objectId");
 var offset = request.params.offset;
 var count = request.params.count;
 if(toUserId==='' || toUserId === null ) response.error("param is null when queryRequestToMeList.");
 AV.Query.doCloudQuery('select * from _User where username = (select fromUser from Relationship where toUser=? and status=1 limit ?,?)',[toUserId,offset,count],
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




// find the ones who I sent request 
//  {"userId":"spring"}
AV.Cloud.define("queryMyRequestList", function(request, response) {
 //var fromUserId = request.params.userId;
 var fromUserId = AV.User.current().get("objectId");
 if(fromUserId==='' || fromUserId === null ) response.error("param is null when queryMyRequestList.");
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
//   {"phone":"15835267789","username":"kitty","password":"1234"}
AV.Cloud.define("regesterTest", function(request, response) {
	var phone = request.params.phone;
	var username = request.params.username;
	var password = request.params.password;
	var gender = request.params.gender;

	if(phone==='' || phone === null ||username==='' || username === null ||password==='' || password === null ||gender==='' || gender === null) response.error("param is null when register.");

	var _User = AV.Object.extend("_User");
	var _User = new _User();

	_User.set("mobilePhoneNumber",phone);
	_User.set("username",username);
	_User.set("password",password);
	_User.set("gender",gender);
	_User.signUp(null, {
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
		response.error("Error " + error.code + " : " + error.message + " when save.");
	  }
	});
})


// regester
//   {"phone":"15835267789","username":"kitty","password":"1234"}
AV.Cloud.define("regesterOnline", function(request, response) {
	var phone = request.params.phone;
	var username = request.params.username;
	var password = request.params.password;
	var gender = request.params.gender;

	if(phone==='' || phone === null ||username==='' || username === null ||password==='' || password === null ||gender==='' || gender === null) response.error("param is null when register.");

	var _User = AV.Object.extend("_User");
	var _User = new _User();

	_User.set("mobilePhoneNumber",phone);
	_User.set("username",username);
	_User.set("password",password);
	_User.set("gender",gender);
	 _User.signUp(null, {
	  success: function(user) {
		var fileUploadControl = $("#profilePhotoFileUpload")[0];
		if (fileUploadControl.files.length > 0) {
		  var file = fileUploadControl.files[0];
		  var name = "photo.jpg";

		  var avFile = new AV.File(name, file);
		  avFile.save().then(function(restult) {
			    //the object was saved successfully.
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
		response.error("Error " + error.code + " : " + error.message + " when save.");
	  }
	});
})




//login
//{"phone":"18055554123","password":"123"}
AV.Cloud.define("login", function(request, response) {

	 var phone = request.params.phone;
	  var password = request.params.password;

	  if(phone==='' || password==='' || phone === null || password=== null) response.error("param is null when query guys InOneUmberCount.");
		

	  AV.User.logInWithMobilePhone(phone, password).then(function(user){
		 var finalResult = {'code':200,'results':success};
	     response.success(finalResult);
	  }, function(err){
		 response.error("faile");
	  });

})




//sendVerifyCode
//{"phone":"18058167549"}
AV.Cloud.define("sendVerifyCode", function(request, response) {

	  var phone = request.params.phone;
	 if(phone==='' || phone === null ) response.error("param is null when query guys sendVerifyCode.");
	  
	  AV.User.requestMobilePhoneVerify(phone).then(function(){
			//发送成功
		   var finalResult = {'code':200,'results':success};
	       response.success(finalResult);
		}, function(err){
		   //发送失败
		   response.success(err);
		});

})



//handleVerifyCode
//{"code":"883769"}
AV.Cloud.define("handleVerifyCode", function(request, response) {
     var code = request.params.code;
	 if(code==='' || code === null ) response.error("param is null when query guys handleVerifyCode.");

	  AV.User.verifyMobilePhone(code).then(function(){
        //验证成功
		var finalResult = {'code':200,'results':success};
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

	if(userId==='' || userId === null ) response.error("param is null when query logOut.");
    var _User = AV.Object.extend('_User');
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
//{"userId":"54a2c310e4b06eb20392b984"}
AV.Cloud.define("showDetail", function(request, response) {
	 
	 //当前用户id
    var userId = request.params.userId;

	if(userId==='' || userId === null ) response.error("param is null when query showDetail.");
    var _User = AV.Object.extend('_User');
    query = new AV.Query(_User);
    query.equalTo("objectId", userId);
  
    query.first({
    success: function(result) {
       var finalResult = {'code':200,'results':result};
	   response.success(finalResult);
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

	if(userId==='' || userId === null ) response.error("param is null when query showDetail.");
    var _User = AV.Object.extend('_User');
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

	if(username==='' || username === null ) response.error("param is null when checkUserName.");

	var _User = AV.Object.extend("_User");
	var _User = new AV.Query(_User);

	_User.equalTo("username",username);

	_User.count( {
	  success: function(user) {
	       var finalResult = {'code':200,'results':user};
	       response.success(finalResult);
	  },
	  error: function(user, error) {
		response.error("Error " + error.code + " : " + error.message + " when save.");
	  }
	});
	 
})



// save location
// {"username":"kitty","startLatitude":1,"startLongitude":1,"endLatitude":2,"endLongitude":2}
AV.Cloud.define("saveRoute", function(request, response) {
    //当前用户id
    var username = request.params.username;
	// start
	var startLatitude = request.params.startLatitude;
	var startLongitude = request.params.startLongitude;
	// end
	var endLatitude = request.params.endLatitude;
	var endLongitude = request.params.endLongitude;
    
	if(startLatitude==='' || startLatitude === null ) response.error("startLatitude is null ");
	if(startLongitude==='' || startLongitude === null ) response.error("startLongitude is null ");
	if(endLatitude==='' || endLatitude === null ) response.error("endLatitude is null ");
	if(endLongitude==='' || endLongitude === null ) response.error("endLongitude is null ");
	if(username==='' || username === null ) response.error("username is null ");
    
    var point = new AV.GeoPoint(startLatitude, startLongitude);
	var endPoint = new AV.GeoPoint(endLatitude, endLongitude);
	
	var Route = AV.Object.extend("Route");
    query = new AV.Query("Route");
	
	var _User = AV.Object.extend("_User");
    user = new AV.Query("_User");

    user.equalTo("username",username);
	user.first( {
	  success: function(user) {
	       query.equalTo("user",user);
	       query.first({
			success: function(result) {
				//not exist, insert;  
				if(!result){
					var Route = AV.Object.extend("Route");
					var route = new Route();
					route.set("start", point);
					//route.set("end", endPoint);
					
					 route.set("user",user);
					 route.save(null, {
					  success: function(result) {
						result.set("end", endPoint);
						result.save(null, {
						  success: function(result) {
							var finalResult = {'code':200,'results':result};
							response.success(finalResult);

						  },
						  error: function(result, error) {
							response.error("Error " + error.code + " : " + error.message + " when save.");
						  }
						});

					  },
					  error: function(result, error) {
						response.error("Error " + error.code + " : " + error.message + " when save.");
					  }
					});
				}else{
				  
				    //or update
					result.set("start", point);
					//result.set("end", endPoint);
				    result.save(null, {
					  success: function(result) {
						result.set("end", endPoint);
						result.save(null, {
						  success: function(result) {
							var finalResult = {'code':200,'results':result};
							response.success(finalResult);

						  },
						  error: function(result, error) {
							response.error("Error " + error.code + " : " + error.message + " when save.");
						  }
						});

					  },
					  error: function(result, error) {
						response.error("Error " + error.code + " : " + error.message + " when update.");
					  }
					});
				}
			},
			error: function(error) {
			  response.error("Error " + error.code + " : " + error.message + " when query guys saveRoute.");
			}
		  });
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
    
	if(latitude==='' || latitude === null ) response.error("latitude is null ");
	if(longitude==='' || longitude === null ) response.error("longitude is null ");
	if(username==='' || username === null ) response.error("username is null ");
    
    var point = new AV.GeoPoint(latitude, longitude);
	var Location = AV.Object.extend("Location");
    query = new AV.Query("Location");
	
	var _User = AV.Object.extend("_User");
    user = new AV.Query("_User");

    user.equalTo("username",username);
	user.first( {
	  success: function(user) {
	       query.equalTo("user",user);
	       query.first({
			success: function(result) {
				//not exist, insert;  
				if(!result){
					var Location = AV.Object.extend("Location");
					var location = new Location();
					location.set("point", point);
					
					 location.set("user",user);
					 location.save(null, {
					  success: function(result) {
						var finalResult = {'code':200,'results':result};
						response.success(finalResult);
					  },
					  error: function(result, error) {
						response.error("Error " + error.code + " : " + error.message + " when save.");
					  }
					});
				}else{
				  
				    //or update
					result.set("point", point);
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
			  response.error("Error " + error.code + " : " + error.message + " when query guys saveaddress.");
			}
		  });
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
  if(isContributor==='' || isContributor === null ) response.error("isContributor is null ");
  if(username==='' || username === null ) response.error("username is null ");

  var _User = AV.Object.extend("_User");
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

