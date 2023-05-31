const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");

const async = require('async');

exports.post_list = function(req, res, next) {
    Post.find()
    .sort([["ascending"]])
    .exec(function (err, list_posts) {
      if (err) {
        return next(err);
      }
      //Successful, so status(200).json
      res.json("post_list", {
        title: "Post List",
        post_list: list_posts,
      });
    });

};

exports.post_detail = (req, res, next) => {
     async.parallel(
        {
            post(callback) {
                Post.findById(req.params.id).exec(callback);
            },
            comment(callback) {
                Comment.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
          if (err) {
            return next (err);
          }
          if(results.post == null) {
            const err = new Error("Article not found");
            err.status = 404;
            return next(err);
          }
          res.json("post_detail", {
            title: "Article detail",
            post: results.post,
            comment: results.comment,
          });
        }
    );
};

exports.post_create_get = (req, res, next) => {
    res.status(200).json("post_create", { title: "Create Post" });
};

exports.post_create_post = [
    body("title", "Article name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("content", "Content is required")
       .trim()
       .isLength({ min: 20 })
       .escape(),
    body("status").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
        res.json("create_post", {
            title: "Create Article",
            post: req.body,
            errors: errors.array(),
        });
        return;
    }
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
    });
    post.save((err) => {
        if (err) {
            return next(err);
        }

    res.redirect('/api/posts')
    })
  }
]

exports.post_update_get = (req, res, next) => {
    async.parallel(
        {
          post(callback) {
            Post.findById(req.params.id)
              .exec(callback);
          },
          comments(callback) {
            Comment.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.post == null) {
            // No results.
            const err = new Error("Article not found");
            err.status = 404;
            return next(err);
          }
          // Success.
          res.json("post_form", {
            title: "Update Article",
            post: results.post,
            comment: results.comments,
          });
        }
    );    
};

exports.post_update_post = [
    body("title", "Article name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("content", "Content is required")
       .trim()
       .isLength({ min: 20 })
       .escape(),

  (req, res, next) => {
    const errors = validationResult(req); 

    const post = new Post({
     title: req.body.title,
     content: req.body.content,
     _id: req.params.id, //This is required, or a new ID would be assigned to the author.
   });
 
     if (!errors.isEmpty()) {
       // There are errors. Render form again with sanitized values/errors messages.
    
      (err,results) => {
        if (err) {
         return next(err);
        }
       res.json("author_form", {
         title: "Update Author",
         books: results.books,
         author,
         errors: errors.array(),
       });
      };
     return;
    }
 
   // Data from form is valid. Update the record
   Post.findByIdAndUpdate(req.params.id, post, {}, (err, thepost)  => {
     if (err) {
       return next(err);
     }

    res.redirect(thepost.url);
   });
 },
 
];

exports.post_delete_get = (req, res, next) => {
    async.parallel(
        {
          post(callback) {
            Post.findById(req.params.id).exec(callback);
          },
          comments(callback) {
            Comment.findById(req.params.id).exec(callback);
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.post == null) {
            res.redirect("/api/posts");
          }
          // Successful, so status(200).json.
          res.json("post_delete", {
            title: "Delete Article",
            post: results.post,
            comment: results.comments
          });
        }
    );
};

exports.post_delete_post = (req, res, next) => {
    async.parallel(
        {
          post(callback) {
            Post.findById(req.body.postid).exec(callback);
          },
          posts_comments(callback) {
            comment.find({ comment: req.body.commentid }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Success
          if (results.posts_comments.length > 0) {
            res.json("post_delete", {
              title: "Post delete",
              post: results.post,
              posts_comments: results.posts_comments,
            });
        return;
          }
          Post.findByIdAndRemove(req.body.postid, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/posts");
          });
        }
      );    
};

exports.post_published = function(req, res) {};

exports.post_saved = function(req, res) {};
