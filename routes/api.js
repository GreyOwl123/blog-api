var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');
const post_controller = require('../controllers/postController');
const author_controller = require('../controllers/authorController');

// Author routes.

router.get('/', author_controller.index);

router.get('/author/signup', author_controller.author_signup_get);

router.post('/author/signup', author_controller.author_signup_post);

router.get('/author/login', author_controller.author_login_get);

router.post('/author/login', author_controller.author_login_post);

router.get('/author/logout', author_controller.author_logout_get);

router.post('/author/logout', author_controller.author_logout_post);

router.get('/author/:id', author_controller.author_detail);

router.get('/author/:id/delete', author_controller.author_delete_get);

router.get('/author/:id/delete', author_controller.author_delete_post);

router.get('/author/:id/update', author_controller.author_update_get);

router.get('/author/:id/update', author_controller.author_update_post);

router.get('/author/:id/posts/:id/published', author_controller.author_published);

router.get('/author/:id/posts/:id/saved', author_controller.author_saved);

// User routes.

router.get('/user/:id/update', user_controller.user_update_get);

router.post('/user/:id/update', user_controller.user_update_post);

router.get('/user/:id/delete', user_controller.user_delete_get);

router.post('/user/:id/delete', user_controller.user_delete_post);

router.get('/user/:id', user_controller.user_detail);

router.get('/users', user_controller.user_list);

router.get('/user/signup', user_controller.user_signup_get);

router.post('/user/signup', user_controller.user_signup_post);

router.get('/user/login', user_controller.user_login_get);

router.post('/user/login', user_controller.user_login_post);

router.get('/user/logout', user_controller.user_logout_get);

router.post('/user/logout', user_controller.user_logout_post);

// Post routes.
router.get('/post/create', post_controller.post_create_get);

router.post('/post/create', post_controller.post_create_post);

router.get('/post/:id/update', post_controller.post_update_get);

router.post('/post/:id/update', post_controller.post_update_post);

router.get('/post/:id/delete', post_controller.post_delete_get);

router.post('/post/:id/delete', post_controller.post_delete_post);

router.get('/post/:id/published', post_controller.post_published);

router.get('/post/:id/saved', post_controller.post_saved);

router.get('/post/:id', post_controller.post_detail);

router.get('/posts', post_controller.post_list);

// Comment routes
router.get('/comment/create', comment_controller.comment_create_get);

router.post('/comment/create', comment_controller.comment_create_post);

router.get('/comment/:id/update', comment_controller.comment_update_get);

router.post('/comment/:id/update', comment_controller.comment_update_post);

router.get('/comment/:id/delete', comment_controller.comment_delete_get);

router.post('/comment/:id/delete', comment_controller.comment_delete_post);

router.get('/comment/:id', comment_controller.comment_detail);

router.get('/comments', comment_controller.comment_list);


module.exports = router;
