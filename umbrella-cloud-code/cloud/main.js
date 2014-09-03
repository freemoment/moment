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
                   var Relationship = Parse.Object.extend('Relationship');
                   var query = new Parse.Query(Relationship);
                   query.equalTo('fromUser', Parse.User.current());
                   query.find({
                              success: function(relationships) {
                                response.success(relationships);
                              },
                              error: function(error) {
                                response.error(error);
                              }
                   });
});