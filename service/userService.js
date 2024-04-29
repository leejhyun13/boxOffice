const logger = require('../lib/logger');
const userDao = require('../dao/usersDao');
const hashUtil = require('../lib/hashUtil');

// 등록
const userService = {
  async reg(params) {
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(params.password);
      logger.debug(`(userService.makePassword) ${JSON.stringify(params.password)}`);
    } catch (err) {
      logger.error(`(userService.makePassword) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    const newParams = {
      ...params,
      password: hashPassword,
    };
    try {
      const inserted = await userDao.insert(newParams);
      logger.debug(`(userService.reg) ${JSON.stringify(inserted)}`);
      return inserted; // 에러가 발생하지 않으면 삽입된 결과를 반환합니다.
    } catch (err) {
      logger.error(`(userService.reg) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },

  // 조회
  async userList(params) {
    try {
      const result = await userDao.selectList(params);
      logger.debug(`(userService.userList) ${JSON.stringify(result)}`);
      return result; // 에러가 발생하지 않으면 조회 결과를 반환합니다.
    } catch (err) {
      logger.error(`(userService.userListErr) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },

  // 상세조회
  async userInfo(params) {
    try {
      const result = await userDao.userInfo(params);
      logger.debug(`(userService.userInfo) ${JSON.stringify(result)}`);
      return result; // 에러가 발생하지 않으면 조회 결과를 반환합니다.
    } catch (err) {
      logger.error(`(userService.userInfoErr) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },

  // 수정
  async edituser(params) {
    try {
      const result = await userDao.userUpdate(params);
      logger.debug(`(userService.userUpdate) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(userService.userUpdateErr) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },

  // 삭제
  async deleteUser(params) {
    try {
      const result = await userDao.userDelete(params);
      logger.debug(`(userService.userDelete) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(userService.userDeleteErr) ${err.toString()}`);
      throw err; // 에러가 발생한 경우에는 즉시 예외를 던집니다.
    }
  },
  // login 프로세스
  async login(params) {
    // 1. 사용자 조회
    let user = null;
    try {
      user = await userDao.selectUser(params);
      logger.debug(`(userService.login) ${JSON.stringify(user)}`);

      // 해당 사용자가 없는 경우 튕겨냄
      if (!user) {
        const err = new Error('Incorect userid');
        logger.error(err.toString());

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      logger.error(`(userService.login) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    // 2. 비밀번호 비교
    try {
      const checkPassword = await hashUtil.checkPasswordHash(params.password, user.password);
      logger.debug(`(userService.checkPassword) ${checkPassword}`);

      // 비밀번호 틀린 경우 튕겨냄
      if (!checkPassword) {
        const err = new Error('Incorect password');
        logger.error(err.toString());

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      logger.error(`(userService.checkPassword) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(user);
    });
  },

};

module.exports = userService;
