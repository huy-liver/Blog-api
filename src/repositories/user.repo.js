const { readData, writeData } = require('../utils/file.util');
const { v4: uuidv4 } = require('uuid');

const FILE_NAME = 'users.json';

const findAll = async () => {
  return await readData(FILE_NAME);
};

const findById = async (id) => {
  const users = await findAll();
  return users.find(u => u.id === id);
};

const findByEmail = async (email) => {
  const users = await findAll();
  return users.find(u => u.email === email);
};

const findByUsername = async (username) => {
  const users = await findAll();
  return users.find(u => u.username === username);
};

const create = async (userData) => {
  const users = await findAll();
  const newUser = { id: uuidv4(), ...userData };
  users.push(newUser);
  await writeData(FILE_NAME, users);
  return newUser;
};

module.exports = { findAll, findById, findByEmail, findByUsername, create };
