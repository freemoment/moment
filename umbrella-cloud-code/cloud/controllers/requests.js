var _ = require('underscore');

var Relationship = Parse.Object.extend('Relationship');

exports.index = function(req, res) {
    var query = new Parse.Query(Relationship);
    query.descending('createdAt');
    query.find().then(function(results) {
                      res.render('posts/index', {
                                 posts: results
                                 });
                      },
                      function() {
                      res.send(500, 'Failed loading posts');
                      });
};

exports.new = function(req, res) {
	var relationship = new Relationship();
    var query = new Parse.Query(Relationship);
    query.equalTo("toUser", request.params.movie);
    var Post = Parse.Object.extend('Post');
    var post = new Post();
    post.id = req.params.post_id;
    comment.set('post', post);
    
    // Explicitly specify which fields to save to prevent bad input data
    comment.save(_.pick(req.body, 'author', 'author_email', 'body')).then(function() {
                                                                          res.redirect('/posts/' + req.params.post_id);
                                                                          },
                                                                          function() {
                                                                          res.send(500, 'Failed saving comment');
                                                                          });
}

curl -X POST \
-H "X-Parse-Application-Id: kROGl6gEeaU2sLlQmyvZc5M9w8KvPrLrEFpY6njO" \
-H "X-Parse-REST-API-Key: UEs4bLxoEod6ijywxt5LO8BSnUuT3yKCIj2GohZz" \
-H "Content-Type: application/json" \
-d '{"userId":"GRELiuFcG7"}' \
https://api.parse.com/1/functions/switchStatus


                        query.get(objectId).then(function(meme) {
                         Parse.Cloud.useMasterKey();
                         
                         // Increment the view counter
                         meme.increment("views");
                         meme.save().then(function() {
                                          res.render('meme/show', {
                                                     meme: meme,
                                                     title: "Show",
                                                     imageUrl: meme.get('image'),
                                                     openGraphTags: {
                                                     title: meme.get('text1') + " " + meme.get('text2'),
                                                     url: "http://www.anymeme.org/meme/" + meme.id,
                                                     image: meme.get('image'),
                                                     type: "website"
                                                     }
                                                     });
                                          }, function(error) {
                                          res.send(error);
                                          });
                         }, function() {
                         res.status(404).send("Meme not found.");
                         });