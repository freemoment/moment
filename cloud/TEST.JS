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