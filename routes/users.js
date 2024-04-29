const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const userService = require('../service/userService');
const { isLoggedIn } = require('../lib/middleware');

// 회원 등록
router.post('/', async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
    };

    logger.info(`(User.reg.params) ${JSON.stringify(params)}`);

    // null 체크 !
    if (!params.email || !params.email.includes('@')) {
      const err = new Error('[ @ 형식의 email ] 입력해주셈');
      const errMsg = new Error('이 분 이메일 입력 안함');
      logger.error(errMsg.toString());
      res.status(400).json({ err: err.toString() });
    }

    if (!params.password) {
      const err = new Error('[ 비밀번호 ] 입력해주셈');
      const errMsg = new Error('비밀번호 입력 안함');
      logger.error(errMsg.toString());
      res.status(400).json({ err: err.toString() });
    }

    if (!params.nickname) {
      const err = new Error('[ 닉네임 ] 입력해주셈');
      const errMsg = new Error('닉네임 입력 안함');
      logger.error(errMsg.toString());
      res.status(400).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await userService.reg(params);
    logger.info('(user.reg.result): #{JSON.stringify(result)}');

    // ***** 최종 응답 *****
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 유저 리스트 조회
router.get('/userList', isLoggedIn, async (req, res) => {
  try {
    const params = {
      email: req.query.email,
      nickname: req.query.nickname,
    };

    const result = await userService.userList(params);
    logger.info(`(User.list.params) ${JSON.stringify(params)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 유저 정보 상세 조회
router.get('/userInfo/:id', isLoggedIn, async (req, res) => {
  try {
    const params = {
      id: req.params.id, // 파라미터를 받아야함
    };
    const result = await userService.userInfo(params);
    logger.info(`(User.info.params) ${JSON.stringify(params)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 유저 정보 수정
router.put('/updateUser/:id', isLoggedIn, async (req, res) => {
  try {
    const params = {
      id: req.params.id,
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
    };
    const result = await userService.edituser(params);
    logger.info(`(User.update.params) ${JSON.stringify(params)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ err: err.toString() });
  }
});

// 유저 정보 삭제
router.delete('/deleteUser/:id', isLoggedIn, async (req, res) => {
  try {
    const params = {
      id: req.params.id,
    };
    const result = await userService.deleteUser(params);
    logger.info(`(User.delete.params) ${JSON.stringify(params)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    logger.error(`(User.delete.params) ${JSON.stringify(err.toString())}`);
    res.status(500).json(err);
  }
});

module.exports = router;
