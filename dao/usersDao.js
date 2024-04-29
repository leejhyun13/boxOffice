const { Op } = require('sequelize');
const { Users } = require('../models/index');

const userDao = {
  // 입력
  insert(params) {
    return new Promise((resolve, reject) => {
      Users.create(params).then((inserted) => {
        resolve(inserted);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // 조회
  selectList(params) {
    // where 검색조건
    const setQuery = {};
    if (params.email) {
      setQuery.where = {
        ...setQuery.where,
        email: { [Op.like]: `%${params.email}%` },
      };
    }
    return Users.findAll();
  },
  // 상세 조회
  userInfo(params) {
    const setQuery = {};
    if (params.id) {
      setQuery.where = { id: params.id };
    }
    return Users.findOne(setQuery); // 수정된 코드
  },
  // 로그인을 위한 사용자 조회
  selectUser(params) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        attributes: ['id', 'email', 'password', 'nickname'],
        where: { email: params.email },
      }).then((selectedOne) => {
        resolve(selectedOne);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // 회원 정보 수정
  userUpdate(params) {
    return new Promise((resolve, reject) => {
      Users.update(
        params,
        {
          where: { id: params.id },
        },
      ).then(([updated]) => {
        resolve({ updatedCount: updated });
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // 정보 삭제
  userDelete(params) {
    return new Promise((resolve, reject) => {
      Users.destroy({
        where: { id: params.id },
      }).then((deleted) => {
        resolve({ deletedCount: deleted });
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

module.exports = userDao;
