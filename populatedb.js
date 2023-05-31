#! /usr/bin/env node

console.log('This script populates some test items to your database. Specified database as argument - e. node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.ybaz7vs.mongodb.net/blog-api?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Author = require('./models/author')
const Comment = require('./models/comment')
const Post = require('./models/post')
const User = require('./models/user')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const authors = []
const comments = []
const posts = []
const users = []

function authorCreate(first_name, last_name, username, password, cb) {
    authordetail = {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
    }
 
  const author = new Author(authordetail);
   
  author.save()
   .then(() => {
    console.log('New Author: ' + author);
    authors.push(author);
   })
 .catch ((err) => {
  console.log(err)
 });
};

function commentCreate(user, content, createdAt, updatedAt, cb) {
   commentdetail = {
    user: user,
    content: content,
    createdAt: createdAt,
    updatedAt: updatedAt,
   }

  const comment = new Comment(commentdetail);
  comment.save()
  .then(() => {
   console.log('New Comment: ' + comment);
   comments.push(comment);
  })
.catch ((err) => {
 console.log(err)
});
};

function postCreate(title, author, content, cb) {
  postdetail = {
    title: title,
    author: author,
    content: content,
  }

  const post = new Post(postdetail);
  post.save()
  .then(() => {
   console.log('New Post: ' + post);
   posts.push(post);
  })
.catch ((err) => {
 console.log(err)
});  
  };  

function userCreate(username, password, cb) {
  userdetail = {
    username: username,
    password: password,
  }

  const user = new User(userdetail);
  user.save()
  .then(() => {
   console.log('New User: ' + user);
   users.push(user);
  })
.catch ((err) => {
 console.log(err)
});
  };


function createAuthors(cb) {
    async.parallel([
        function(callback) {
          authorCreate('Rho', 'Sorrow', 'Le Che', 'trv23_yus', callback);
        },
        ],
        // optional callback
        cb);
}


function createComments(cb) {
    async.parallel([
        function(callback) {
          commentCreate('BlackBird', 'Free as in Free Speech.', callback);
        },
        ],
        // optional callback
        cb);
}


function createPosts(cb) {
    async.parallel([
        function(callback) {
          postCreate('Libre ou Gratis', 'Le Che', 'Why should we not be free, I will have my speech, not beer.', callback)
        },
        ],
        // Optional callback
        cb);
}


function createUsers(cb) {
  async.parallel([
      function(callback) {
        userCreate('BlackBird', 'pugfhb.363', callback)
      },
  ],
  // Optional callback
     cb);
}

async.series([
    createAuthors,
    createComments,
    createPosts,
    createUsers,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('All done');

    }
    // All done, disconnect from database
    mongoose.connection.close();
});




