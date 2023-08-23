const Author = require('../models/author');
const Post = require('../models/post');
const async = require('async');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JSON_WEB_TOKEN;
const bcryptjs = require("bcryptjs");
const passport = require("passport")

/*
 GET THE INFORMATION IN JSON FORMAT FROM THE MONGODB DATABASE AND RETURN IT IN 
 JSON FORM USING RES.JSON WHCH WILL BE CONSUMED ON THE FRONT END 
*/

exports.author_signup = [
    body("first_name", "Author name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("last_name", "Last name is required")
       .trim()
       .isLength({ min: 1 })
       .escape(),
    body("username", "Username is required")
       .trim()
       .isLength({ min: 4 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric(),

  (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
     const author = new Author({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
    })
    .then((author) => {
      const timeLimit = 2 * 60 * 60;
      const token = jwt.sign(
        { id: author._id, username, role: author.role },
      jwtSecret,
      {
        expiresIn: timeLimit,
      }
     ); 
     res.cookie("jwt", token, {
       httpOnly: true,
       timeLimit: timeLimit * 1000,
    });
  })
   await author.save()
      .then(() =>{
        res.status(200).json({
          message: "Signup Successful",
          author,
        })
      })
      .catch((err) => {
       res.status(401).json({
         message: "Signup Failed",
         error: err.message,
       })
      })
    res.redirect('/author/login')
    })
  }
 }
]

exports.author_login = 
   passport.authenticate("local", {
      session:false,
      successRedirect: "",
      failureRedirect: "",
   });

exports.author_logout = (req, res) => {}

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
          res.status(200).json({
            author: results.author,
            post: results.post,
          });
        }
    )
  }

exports.author_delete = (req, res, next) => {
    async.parallel(
        {
          author(callback) {
            Author.findById(req.body.authorid).exec(callback);
          },
          authors_posts(callback) {
            Post.find({ author: req.body.authorid }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.authors_posts.length > 0) {
            res.json({
              author: results.author,
              author_posts: results.authors_posts,
            });
        return;
          }
          Author.findByIdAndRemove(req.body.authorid, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/api/authors");
          });
        }
    );    
};

exports.author_update = [
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
        .isAlphanumeric(),

  (req, res, next) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
    const author = new Author({
     first_name: req.body.first_name,
     family_name: req.body.family_name,
     date_of_birth: req.body.date_of_birth,
     date_of_death: req.body.date_of_death,
     _id: req.params.id, 
   });
  }
   Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor)  => {
     if (err) {
       return next(err);
     }
    res.redirect(theauthor.url);
   });
 },
 ];