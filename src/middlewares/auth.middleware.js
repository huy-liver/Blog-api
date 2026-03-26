const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env.config');
const userRepo = require('../repositories/user.repo');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      
      const user = await userRepo.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User không tồn tại, xác thực thất bại' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Xác thực thất bại, token không hợp lệ' });
    }
  } else {
    res.status(401).json({ error: 'Không tìm thấy token cấu hình Authorization Bearer' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Không có quyền truy cập, yêu cầu quyền Admin' });
  }
};

module.exports = { protect, admin };
