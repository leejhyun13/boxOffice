const { sequelize } = require('./connection');
const Users = require('./users');
const Comments = require('./movieComment');

const db = {};

db.sequelize = sequelize;

// model 생성
db.Users = Users;
db.Comments = Comments;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize);
  }
});

// model init
// Users.init(sequelize);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
