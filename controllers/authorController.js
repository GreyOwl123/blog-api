const Author = require('../models/author');
const Post = require('../models/post');
const async = require('async');
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
    res.json('index');
};

exports.author_signup_get = (req, res, next) => {
   res.json("author_signup");
};

exports.author_signup_post = [
    body("first_name", "Author name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("last_name", "Last name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("username")
       .trim()
       .isLength({ min: 4 })
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

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json("", {
            user: req.body,
            errors: errors.array(),
        });
        return;
    }
    // Create a Author object with escaped and trimmed data.
    const author = new Author({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
    });
    author.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/author/login')
    })
  }
]

exports.author_login_get = (req, res, next) => {
    res.json("/author/login")
};

exports.author_login_post = (req, res) => {
  res.json("/author/login")
};

exports.author_logout_get = (req, res) => {
    res.json("/author/logout", { title: "Log Out" })
};

exports.author_logout_post = (req, res) => {};

exports.author_detail = (req, res, next) => {
    async.parallel(
        {
            author(callback) {
                Author.findById(req.params.id).exec(callback);
            },
            post(callback) {
                Post.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
          if (err) {
            return next (err);
          }
          if(results.author == null) {
            const err = new Error("Account not found");
            err.status = 404;
            return next(err);
          }
          res.json("author_detail", {
            title: "Account detail",
            author: results.author,
            post: results.post,
          });
        }
    );
};


exports.author_delete_get = (req, res, next) => {
    async.parallel(
        {
          author(callback) {
            Author.findById(req.params.id).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.author == null) {
            // No results.
            res.redirect("/api/authors");
          }
          // Successful, so.json.
          res.json("author_delete", {
            title: "Delete Author",
            author: results.author,
          });
        }
    );
};

exports.author_delete_post = (req, res, next) => {
    async.parallel(
        {
          author(callback) {
            Author.findById(req.body.authorid).exec(callback);
          },
          authors_books(callback) {
            Book.find({ author: req.body.authorid }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Success
          if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.json("author_delete", {
              title: "Delete Author",
              author: results.author,
              author_books: results.authors_books,
            });
        return;
          }
          // Author has no books. Delete object and redirect to the list of authors.
          Author.findByIdAndRemove(req.body.authorid, (err) => {
            if (err) {
              return next(err);
            }
            // Success - go to author list
            res.redirect("/api/authors");
          });
        }
    );    
};

exports.author_update_get = (req, res, next) => {
    async.parallel(
        {
          author(callback) {
            Author.findById(req.params.id)
              .exec(callback);
          },
          books(callback) {
            Book.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.author == null) {
            // No results.
            const err = new Error("Author not found");
            err.status = 404;
            return next(err);
          }
          // Success.
          res.json("author_form", {
            books: results.books,
            author: results.author,
          });
        }
    );
};

exports.author_update_post = [
    body("first_name", "Author name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("last_name", "Last name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("username")
       .trim()
       .isLength({ min: 4 })
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

    // Create an Author object with escaped/trimmed data and old id.
    const author = new Author({
     first_name: req.body.first_name,
     family_name: req.body.family_name,
     date_of_birth: req.body.date_of_birth,
     date_of_death: req.body.date_of_death,
     _id: req.params.id, //This is required, or a new ID would be assigned to the author.
   });
 
     if (!errors.isEmpty()) {
       // There are errors. Render form again with sanitized values/errors messages.
 
       // Get all books for form.
     async.parallel(
       {
         books(callback) {
           Book.find(callback);
         },
       },
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
      }
     );
     return;
    }

   // Data from form is valid. Update the record
   Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor)  => {
     if (err) {
       return next(err);
     }

   //Successful: redirect to author detail page.
    res.redirect(theauthor.url);
   });
 },

 ];



exports.author_published = function(req, res, next) {};

exports.author_saved = function (req, res) {};
