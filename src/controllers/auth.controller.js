const authService = require('../services/auth.service');

const registerUser = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (error) {
    if (error.message.includes('đăng ký') || error.message.includes('sử dụng')) {
        return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
