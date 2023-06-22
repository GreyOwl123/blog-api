const User = require('../models/user');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");

const async = require('async');

exports.user_signup =[ 
    body("username")
       .trim()
       .isLength({ min: 3 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric()
        .withMessage("Password must contain alphanumeric characters."),

    (req, res, next) => {
        const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
        res.render("user_signup", {
            title: "Sign Up",
            user: req.body,
            errors: errors.array(),
        });
        return;
    }
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    // res.json
    user.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login')
    })
   }
]

exports.user_login = (req, res, next) => {};

exports.user_logout = (req, res, next) => {};

exports.user_list = (req, res, next) => {
  res.status(200).json();
};

exports.user_detail = function(req, res, next) {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.id).exec(callback);
            },
            comments(callback) {
                Comment.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
          if (err) {
            return next (err);
          }
          if(results.user == null) {
            const err = new Error("User not found");
            err.status = 404;
            return next(err);
          }
          res.status(200).json("user_detail", {
            title: "User detail",
            user: results.user,
            comment: results.comments,
          });
        }
    );
};

exports.user_update = [ 
    body("username")
       .trim()
       .isLength({ min: 3 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric()
        .withMessage("Password must contain alphanumeric characters."),

    (req, res, next) => { const errors = validationResult(req); 

    const user = new User({
     username: req.body.username,
     password: req.body.password,
     _id: req.params.id, 
   });
 
     if (!errors.isEmpty()) {
      (err,results) => {
        if (err) {
         return next(err);
        }
       res.render("user_form", {
         title: "Update User",
         user: results.user,
         comments: results.comment,
         errors: errors.array(),
       });
      };
     return;
    }
   User.findByIdAndUpdate(req.params.id, user, {}, (err, theuser)  => {
     if (err) {
       return next(err);
     }
 
    res.redirect(theuser.url);
   });
 },
];

exports.user_delete = (req, res, next) =>{ 
    async.parallel(
    {
      user(callback) {
        User.findById(req.body.userid).exec(callback);
      },
      users_comments(callback) {
        User.find({ user: req.body.userid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.users_comments.length > 0) {
        res.render("user_delete", {
          title: "Delete Account",
          user: results.user,
          user_comments: results.users_comments,
        });
	return;
      }
      User.findByIdAndRemove(req.body.userid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  );
};
