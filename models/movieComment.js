const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      nickname: {
        type: Sequelize.STRING(255),
      },
      email: {
        type: Sequelize.STRING(255),
      },
      content: {
        type: Sequelize.TEXT,
      },
      movieCode: {
        type: Sequelize.INTEGER,
      },
    }, {
      sequelize,
      underscored: true, // true: underscored, false: camelCase
      timestamps: true, // createAt, updatedAt
      paranoid: true, // deletedAt
    });
  }

  static associate(db) {
    db.Comments.belongsTo(db.Users, { foreignKey: { name: 'userId', onDelete: 'SET NULL', as: 'User' } });
  }
};
