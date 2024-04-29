const logger = require('../lib/logger');
const commentDao = require('../dao/commentDao');

const commentService = {
  async reg(params) {
    let inserted = null;
    try {
      inserted = await commentDao.insert(params);
      logger.debug(`commentService.reg : ${JSON.stringify(inserted)}`);
    } catch (err) {
      logger.error(`commentService.reg: ${err}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  // 조회
  async commentList(params) {
    try {
      const result = await commentDao.selectList(params);
      logger.debug(`(commentService.commentList) ${JSON.stringify(result)}`);
      return result; // 에러가 발생하지 않으면 조회 결과를 반환합니다.
    } catch (err) {
      logger.error(`(commentService.commentListErr) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },
};

module.exports = commentService;
