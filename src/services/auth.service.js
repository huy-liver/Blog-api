const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repo');
const { jwtSecret, jwtExpiresIn } = require('../config/env.config');

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });
};

const register = async (userData) => {
  const { username, email, password } = userData;

  const userExistsByEmail = await userRepo.findByEmail(email);
  if (userExistsByEmail) throw new Error('Email này đã được đăng ký');

  const userExistsByUsername = await userRepo.findByUsername(username);
  if (userExistsByUsername) throw new Error('Username này đã được sử dụng');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userRepo.create({
    username,
    email,
    password: hashedPassword,
    role: 'user' // Admin có chức năng xóa bài viết
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser.id)
  };
};

const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user.id)
  };
};

module.exports = { register, login };
