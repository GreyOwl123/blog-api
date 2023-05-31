const Comment = require('../models/comment');
const User = require('../models/user');
const async = require('async');
const { body, validationResult } = require("express-validator");

exports.comment_list = function(req, res, next) {
    Comment.find()
    .sort([["ascending"]])
    .exec(function (err, list_comments) {
      if (err) {
        return next(err);
      }
      //Successful
      res.json("comment_list", {
        title: "Post List",
        post_list: list_posts,
      });
    });
};

exports.comment_detail = (req, res, next) => {
     async.parallel(
        {
            comment(callback) {
                Comment.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
          if (err) {
            return next (err);
          }
          if(results.comment == null) {
            const err = new Error("Account not found");
            err.status = 404;
            return next(err);
          }
          res.status(200).json("author_detail", {
            title: "Account detail",
            author: results.author,
            post: results.post,
          });
        }
    );
};

exports.comment_create_get = (req, res, next) => {
    res.status(200).json("comment_create", { title: "Comment"});
};

exports.comment_create_post = [
    body("content", "Content is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
        res.status(200).json("content_create", {
            title: "Reply",
            comment: req.body,
            errors: errors.array(),
        });
        return;
    }
    const comment = new Comment({
        content: req.body.content,
    });
    comment.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/comments')
    })
  }
]

exports.comment_update_get = (req, res, next) => {
    async.parallel(
        {
          comment(callback) {
            Comment.findById(req.params.id)
              .exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.comment == null) {
            // No results.
            const err = new Error("Comment not found");
            err.status = 404;
            return next(err);
          }
          // Success.
          res.json("comment_form", {
            title: "Edit Reply",
            comment: results.comment,
          });
        }
    );    
};

exports.comment_update_post = [
    body("content", "Content is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),

  (req, res, next) => {
    const errors = validationResult(req); 

    const comment = new Comment({
     content: req.body.content,
     _id: req.params.id, //This is required, or a new ID would be assigned to the author.
   });
 
     if (!errors.isEmpty()) {
       // There are errors. Render form again with sanitized values/errors messages.
 
      (err,results) => {
        if (err) {
         return next(err);
        }
       res.json("comment_form", {
         title: "Edit Reply",
         author: results.comment,
         errors: errors.array(),
       });
      };
     return;
    }
 
   // Data from form is valid. Update the record
   Comment.findByIdAndUpdate(req.params.id, comment, {}, (err, thecomment)  => {
     if (err) {
       return next(err);
     }
 
   //Successful: redirect to author detail page.
    res.redirect(thecomment.url);
   });
 },
 
];

exports.comment_delete_get = (req, res, next) => {
    async.parallel(
        {
          comment(callback) {
            Comment.findById(req.params.id).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.comment == null) {
            // No results.
            res.redirect("/api/post/postid");
          }
          // Successful, so.json.
          res.json("comment_delete", {
            title: "Delete comment",
            comment: results.comment,
          });
        }
    );
};

exports.comment_delete_post = (req, res, next) => {
    async.parallel(
        {
          comment(callback) {
            Comment.findById(req.body.commentid).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Success
          if (results.comment.length > 0) {
            // Render in same way as for GET route.
            res.json("comment_delete", {
              title: "Delete Comment",
              comment: results.comment,
            });
        return;
          } 
          Comment.findByIdAndRemove(req.body.commentid, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/api/post/postid");
          });
        }
      );    
};


