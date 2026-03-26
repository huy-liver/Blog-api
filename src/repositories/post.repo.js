const { readData, writeData } = require('../utils/file.util');
const { v4: uuidv4 } = require('uuid');

const FILE_NAME = 'posts.json';

const findAll = async () => {
  return await readData(FILE_NAME);
};

const findById = async (id) => {
  const posts = await findAll();
  return posts.find(p => p.id === id);
};

const create = async (postData) => {
  const posts = await findAll();
  const newPost = { 
    id: uuidv4(), 
    ...postData, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.push(newPost);
  await writeData(FILE_NAME, posts);
  return newPost;
};

const update = async (id, postData) => {
  const posts = await findAll();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  posts[index] = { ...posts[index], ...postData, id, updatedAt: new Date().toISOString() };
  await writeData(FILE_NAME, posts);
  return posts[index];
};

const remove = async (id) => {
  const posts = await findAll();
  const initialLength = posts.length;
  const filteredPosts = posts.filter(p => p.id !== id);
  
  if (filteredPosts.length === initialLength) return false;
  
  await writeData(FILE_NAME, filteredPosts);
  return true;
};

module.exports = { findAll, findById, create, update, remove };
