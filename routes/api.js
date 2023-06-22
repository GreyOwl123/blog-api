var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');
const post_controller = require('../controllers/postController');
const author_controller = require('../controllers/authorController');

// Author routes.

router.get('/', author_controller.index);

router.post('/author/signup', author_controller.author_signup);

router.post('/author/login', author_controller.author_login);

router.post('/author/logout', author_controller.author_logout);

router.get('/author/:id', author_controller.author_detail);

router.get('/authors', author_controller.author_list);

router.post('/author/:id/delete', author_controller.author_delete);

router.post('/author/:id/update', author_controller.author_update);

// User routes.

router.post('/user/:id/update', user_controller.user_update);

router.post('/user/:id/delete', user_controller.user_delete);

router.get('/user/:id', user_controller.user_detail);

router.get('/users', user_controller.user_list);

router.post('/user/signup', user_controller.user_signup);

router.post('/user/login', user_controller.user_login);

router.post('/user/logout', user_controller.user_logout);

// Post routes

router.post('/post/create', post_controller.post_create);

router.post('/post/:id/update', post_controller.post_update);

router.post('/post/:id/delete', post_controller.post_delete);

router.get('/post/:id', post_controller.post_detail);

router.get('/posts', post_controller.post_list);

// Comment routes

router.post('/comment/create', comment_controller.comment_create);

router.post('/comment/:id/update', comment_controller.comment_update);

router.post('/comment/:id/delete', comment_controller.comment_delete);

router.get('/comment/:id', comment_controller.comment_detail);

router.get('/comments', comment_controller.comment_list);


module.exports = router;
