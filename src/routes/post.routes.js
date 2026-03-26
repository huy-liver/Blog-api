const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  searchPosts, 
  getMyPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { postBodySchema } = require('../utils/validation.schemas');

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/my-posts', protect, getMyPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.single('image'), validate(postBodySchema), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
