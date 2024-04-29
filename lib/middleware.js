const tokenUtil = require('./tokenUtil');

const middleware = {
  isLoggedIn(req, res, next) {
    const token = req.headers && req.headers.token;

    if (token) {
      // 1. 토큰 유효한지 확인
      const decoded = tokenUtil.verifyToken(token);

      if (decoded) {
        // 2. 토큰 유효하면 새로운 토큰으로 갱신(만기시간 초기화)
        const newToken = tokenUtil.makeToken(decoded);
        res.set('token', newToken);
        req.tokenUser = decoded;

        next();
      } else {
        const err = new Error('유효하지않은 토큰입니다.');
        res.status(401).json({ err: err.toString() });
      }
    } else {
      const err = new Error('토큰이 없습니다.');
      res.status(401).json({ err: err.toString() });
    }
  },
};
module.exports = middleware;
