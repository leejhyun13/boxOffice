const jwt = require('jsonwebtoken');

const secretKey = process.env.TOEKN_SECRET;
const options = {
  expiresIn: process.env.TOKEN_EXPIRESIN, // 만료시간
};

const tokenUtil = {
  // 토큰 생성
  makeToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    const token = jwt.sign(payload, secretKey, options);

    return token;
  },
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);

      return decoded;
    } catch (err) {
      return null;
    }
  },
};

module.exports = tokenUtil;
