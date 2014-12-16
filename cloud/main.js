// count of contribution  :取正在共伞的数量  done
AV.Cloud.define("InOneUmberCount", function(request, response) {
  var Relationship = AV.Object.extend('Relationship');
  query = new AV.Query(Relationship);
  query.equalTo("isActive", true);
    query.equalTo("status", request.params.status);
  query.count({
    success: function(count) {
        alert('count: ' + count);
        response.success(count);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys InOneUmberCount.");
    }
  });
});

// 发一个请求  done, 
AV.Cloud.define("requestToSomeone", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

    var Relationship = AV.Object.extend('Relationship');
    query = new AV.Query(Relationship);
    query.equalTo("fromUser", fromUserId);
    query.equalTo("toUser", toUserId);
    query.equalTo("status", 1);
  
    query.first({
    success: function(result) {
        //already exist, do nothing;  
        if(!result){
            var relationship = new Relationship();

            relationship.set("fromUser",fromUserId);
            relationship.set("toUser",toUserId);
            relationship.set("isActive",true);
            relationship.set("status",1);
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


// 取消一个请求  done
AV.Cloud.define("cancelRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

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
        alert('Failed to find object before destroy, with error code: ' + error.message);
      }
    });
});







// 拒绝一个请求  done
AV.Cloud.define("rejectRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

    // var fromUserId = "testone11";
    // var toUserId = "testtwo1";

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

});




// agree a request   
// todo: implement again
AV.Cloud.define("agreeRequest", function(request, response) {
    //当前用户id
    var fromUserId = request.params.userId;
    var toUserId = request.params.toUserId;

    // var fromUserId = "testone11";
    // var toUserId = "testtwo1";

    var Relationship = AV.Object.extend("Relationship");
    var relationship = new Relationship();

    relationship.set("fromUser",fromUserId);
    relationship.set("toUser",toUserId);
    relationship.set("isActive",true);
    relationship.set("status",3);
     relationship.save(null, {
      success: function(relationship) {
        response.success("success");

      },
      error: function(relationship, error) {
        response.error("Error " + error.code + " : " + error.message + " when save.");
      }
    });

});



// find the ones who have umber  
// todo: implement again
AV.Cloud.define("queryUmberOnes", function(request, response) {
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
// todo: implement again
AV.Cloud.define("queryRequestToMeList", function(request, response) {
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



// find the ones who I sent request 
// todo: implement again
AV.Cloud.define("queryMyRequestList", function(request, response) {
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



// find the current ones who finish register
// todo: implement again
AV.Cloud.define("finishRegister", function(request, response) {
  var User = AV.Object.extend('User');
  query = new AV.Query(User);
  query.first({
    success: function(result) {
        response.success(result);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys queryUmberOnes.");
    }
  });
})


// find the current ones who finish login
// todo: implement again
AV.Cloud.define("finishlogin", function(request, response) {
  var User = AV.Object.extend('User');
  query = new AV.Query(User);
  query.first({
    success: function(result) {
        response.success(result);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys queryUmberOnes.");
    }
  });
})




// request some one's desc
// todo: implement again
AV.Cloud.define("queryDescForUserName", function(request, response) {
  var User = AV.Object.extend('User');
  query = new AV.Query(User);
  query.first({
    success: function(result) {
        response.success(result);

    },
    error: function(error) {
      response.error("Error " + error.code + " : " + error.message + " when query guys queryUmberOnes.");
    }
  });
})


Parse.Cloud.define("switchStatus", function(request, response) {
                   
                   var userId = request.params.userId;
                   var userQuery = new Parse.Query(Parse.User);

                   userQuery.get(userId, {
                                 success: function(user) {
                                 var query = new Parse.Query('UmbrellaContribution');
                                 query.equalTo('user', user);
                                 query.first({
                                             success: function(contribution) {
                                                var isContributor = contribution.get('isContributor');
                                                if(isContributor) {
                                                    contribution.set('isContributor', false);
                                                } else {
                                                    contribution.set('isContributor', true);
                                                }
                                             contribution.save().then(function(){
                                                                        response.success("switched");
                                                                      },function(error){
                                                                        response.error(error);
                                                                      });
                                             },
                                             error: function(error) {
                                                response.error(error);
                                             }
                                 });
                                 },
                                 error: function(user, error) {
                                    response.error(error);
                                 }
                   });
});

Parse.Cloud.define("findAllInquiries", function(request, response) {
                   
                   var userId = request.params.userId;
                   
                   var Relationship = Parse.Object.extend('Relationship');
                   var query = new Parse.Query(Relationship);
                   query.equalTo('fromUser', userId);
                   query.equalTo('isActive', true);
                   query.equalTo('status', 1);
                   query.find({
                              success: function(relationships) {
                                response.success(relationships);
                              },
                              error: function(error) {
                                response.error(error);
                              }
                    });
});

Parse.Cloud.define("findAllRequests", function(request, response) {
                   var userId = request.params.userId;
                   
                   var Relationship = Parse.Object.extend('Relationship');
                   var query = new Parse.Query(Relationship);
                   query.equalTo('toUser', userId);
                   query.equalTo('isActive', true);
                   query.equalTo('status', 1);
                   query.find({
                              success: function(relationships) {
                                response.success(relationships);
                              },
                              error: function(error) {
                                response.error(error);
                              }
                    });
});

Parse.Cloud.define("endSharingUmbrella", function(request, response) {
                   var userId = request.params.userId;
                   
                   var Relationship = Parse.Object.extend('Relationship');
                   var query = new Parse.Query(Relationship);
                   Parse.Query.or(query.equalTo('fromUser', userId), query.equalTo('toUser', userId)).equalTo('status', 3).equalTo('isActive', true).first({
                
                              success: function(relationship) {
                               relationship.set('isActive', false);
                               relationship.save().then(function(){
                                                            response.success("end");
                                                        },function(error){
                                                            response.error(error);
                                });
                              },
                              error: function(error) {
                              response.error(error);
                              }
                              });
});

Parse.Cloud.define(“getAllUsersWithUmbrella” function(request, response) {
	var userId = request.params.userId;

	var userQuery = new Parse.Query(Parse.User);
	userQuery.get(userId, {
		success: function(user) {
			var gender = user.get(‘gender’);
			var usersQuery = new Parse.Query(Parse.User);
			var condition = 1;
			if(condition == gender) {
				condition = 0;
			}
			usersQuery.equal(‘gender’, condition);
			usersQuery.find({
				success: function(users) {
					var UmbrellaContribution = Parse.Object.extend(‘UmbrellaContribution’);
					var userWithUmbrellaQuery = new Parse.Query(UmbrellaContribution);
					userWithUmbrellaQuery.equalTo(‘isContributor’, true);
					userWithUmbrellaQuery.find({
						success: function(usersWithUmbrella) {
							var intersection = getInterscetion(users, usersWithUmbrella);
							var Route = Parse.Ojbect.extend(‘Route’);
							var routeQuery = new Parse.Query(‘Route’);
							
						},
						error: function(error) {

						}
					});
				},
				error: function(error) {
					response.error(error);
				}
			});
		},
		error: function(error) {
			response.error(error);
		}
	});
});

var getIntersectionUsers = function(users1, users2) {
	var intersection = new Array();
	var index = 0;
	for(var i=0; i<users.length; i++) {
		var user = users1[i];
		for(var j=0; j<users2.length; j++) {
			var userWithUmbrella = users2[j];
			if(user == users2.user) {
				intersection[index++] = user;
			}
		}
	}
}