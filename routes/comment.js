const express = require('express');
const logger = require('../lib/logger');
const commentService = require('../service/commentService');
const { isLoggedIn } = require('../lib/middleware');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { tokenUser } = req;

    // 토큰으로부터 유저의 정보를 추출하여 변수에 저장
    const { email } = tokenUser;
    const { nickname } = tokenUser;

    const params = {
      email,
      nickname,
      content: req.body.content,
      movieCode: req.body.movieCode,
    };

    if (!params.content || !params.movieCode) {
      const err = new Error('내용과 영화 코드를 입력해주세요.');
      logger.error(`필수 필드 누락 ${err.toString()}`);
      res.status(400).json({ err: err.toString() });
      return;
    }

    // commentService.reg 메서드를 호출하여 댓글 등록
    const result = await commentService.reg(params);
    logger.info(`(comment.reg.result): ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(201).json('댓글 등록 성공');
  } catch (err) {
    logger.error(`오류 이유: ${err.toString()}`);
    res.status(500).json('오류 발생');
  }
});

router.get('/commentList', async (req, res) => {
  try {
    const params = {
      nickname: req.query.nickname,
      content: req.query.content,
    };

    const result = await commentService.commentList(params);
    logger.info(`(Comment.list.params) ${JSON.stringify(params)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
