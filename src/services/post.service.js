const postRepo = require('../repositories/post.repo');

const getAllPosts = async (page = 1, limit = 10) => {
  const posts = await postRepo.findAll();
  
  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    totalItems: posts.length,
    totalPages: Math.ceil(posts.length / limit),
    currentPage: parseInt(page),
    posts: paginatedPosts
  };
};

const getPostById = async (id) => {
  const post = await postRepo.findById(id);
  if (!post) throw new Error('Bài viết không tồn tại');
  return post;
};

const createPost = async (postData) => {
  return await postRepo.create(postData);
};

const updatePost = async (id, postData, userId, userRole) => {
  const post = await postRepo.findById(id);
  if (!post) throw new Error('Bài viết không tồn tại');

  if (post.author !== userId && userRole !== 'admin') {
    throw new Error('Forbidden: Bạn không có quyền sửa bài viết này');
  }

  return await postRepo.update(id, postData);
};

const deletePost = async (id, userId, userRole) => {
  const post = await postRepo.findById(id);
  if (!post) throw new Error('Bài viết không tồn tại');

  if (post.author !== userId && userRole !== 'admin') {
    throw new Error('Forbidden: Bạn không có quyền xóa bài viết này');
  }

  await postRepo.remove(id);
  return { message: 'Bài viết đã bị xóa' };
};

const getMyPosts = async (userId) => {
  const posts = await postRepo.findAll();
  return posts.filter(p => p.author === userId);
};

const searchPosts = async (q, tag) => {
  let posts = await postRepo.findAll();

  if (q) {
    const lowerQ = q.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(lowerQ) || 
      p.content.toLowerCase().includes(lowerQ)
    );
  }

  if (tag) {
    posts = posts.filter(p => 
      p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return posts;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  searchPosts
};
