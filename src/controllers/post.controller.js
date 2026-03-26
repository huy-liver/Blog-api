const postService = require('../services/post.service');

const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await postService.getAllPosts(page, limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const searchPosts = async (req, res, next) => {
  try {
    const { q, tag } = req.query;
    const data = await postService.searchPosts(q, tag);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const data = await postService.getMyPosts(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    if (req.params.id === 'my-posts' || req.params.id === 'search') return next();
    
    const data = await postService.getPostById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    let tags = [];
    if (req.body.tags) {
        if (typeof req.body.tags === 'string') {
            try {
                tags = JSON.parse(req.body.tags);
            } catch (e) {
                tags = req.body.tags.split(',').map(tag => tag.trim());
            }
        } else if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
        }
    }

    const postData = {
      title: req.body.title,
      content: req.body.content,
      tags: tags,
      author: req.user.id,
      imageUrl: req.file ? `/public/uploads/${req.file.filename}` : null
    };

    const data = await postService.createPost(postData);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags) {
        if (typeof req.body.tags === 'string') {
            try {
                updateData.tags = JSON.parse(req.body.tags);
            } catch (e) {
                updateData.tags = req.body.tags.split(',').map(t => t.trim());
            }
        }
    }

    if (req.file) {
      updateData.imageUrl = `/public/uploads/${req.file.filename}`;
    }

    const data = await postService.updatePost(req.params.id, updateData, req.user.id, req.user.role);
    res.json(data);
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('không tồn tại')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const data = await postService.deletePost(req.params.id, req.user.id, req.user.role);
    res.json(data);
  } catch (error) {
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('không tồn tại')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  getPosts,
  searchPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
