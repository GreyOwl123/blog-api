const User = require('../models/user');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");

const async = require('async');

exports.user_signup_get = (req, res, next) => {
    res.json("user_signup", { title: "Sign Up" });
};

exports.user_signup_post =[ 
    body("username")
       .trim()
       .isLength({ min: 3 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric()
        .withMessage("Password must contain alphanumeric characters."),
    body("passwordConfirmation")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric()
        .custom((value, {req}) => {
             return value === req.body.password;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
        res.status(200).json("user_signup", {
            title: "Sign Up",
            user: req.body,
            errors: errors.array(),
        });
        return;
    }
    // Create a User object with escaped and trimmed data.
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    user.save((err) => {
        if (err) {
            return next(err);
        }

        res.redirect('/login')
    })
   }
]

exports.user_login_get = (req, res, next) => {
    res.status(200).json("user_login", { title: "Sign Up" });
};

exports.user_login_post = (req, res, next) => {};

exports.user_logout_get = (req, res, next) => {
    res.status(200).json("logout", { title: "Log Out" });
};

exports.user_logout_post = (req, res, next) => {};

exports.user_list = (req, res, next) => {
  res.status(200).json("users");
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


exports.user_update_get = (req, res, next) => {
    async.parallel(
        {
          user(callback) {
            User.findById(req.params.id)
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
          if (results.user == null) {
            // No results.
            const err = new Error("Account not found");
            err.status = 404;
            return next(err);
          }
          // Success.
          res.json("user_form", {
            title: "Update Account",
            users: results.user,
            comment: results.comment,
          });
        }
    );    
};

exports.user_update_post = [ 
    body("username")
       .trim()
       .isLength({ min: 3 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric()
        .withMessage("Password must contain alphanumeric characters."),
    body("passwordConfirmation")
        .trim()
        .isLength({ min: 6 })
        .custom((value, {req}) => {
             return value === req.body.password;
        }),

    (req, res, next) => { const errors = validationResult(req); 

    const user = new User({
     first_name: req.body.first_name,
     last_name: req.body.last_name,
     // old password
     //new password
     _id: req.params.id, //This is required, or a new ID would be assigned to the author.
   });
 
     if (!errors.isEmpty()) {
       // There are errors. Render form again with sanitized values/errors messages.
 

      (err,results) => {
        if (err) {
         return next(err);
        }
       res.json("user_form", {
         title: "Update User",
         user: results.user,
         comments: results.comment,
         errors: errors.array(),
       });
      };
     return;
    }
 
   // Data from form is valid. Update the record
   User.findByIdAndUpdate(req.params.id, user, {}, (err, theuser)  => {
     if (err) {
       return next(err);
     }
 
   //Successful: redirect to author detail page.
    res.redirect(theuser.url);
   });
 },
];
 

exports.user_delete_get = (req, res, next) => {
      async.parallel(
    {
      user(callback) {
        User.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        // No results.
        res.redirect("/api/users");
      }
      // Successful.
      res.json("user_delete", {
        title: "Delete Account",
        user: results.user,
      });
    }
  );
};

exports.user_delete_post = (req, res, next) =>{ 
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
        // Render in same way as for GET route.
        res.json("user_delete", {
          title: "Delete Account",
          user: results.user,
          user_comments: results.users_comments,
        });
	return;
      }
      // Delete object and redirect to the list of authors.
      User.findByIdAndRemove(req.body.userid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/catalog/users");
      });
    }
  );
};
