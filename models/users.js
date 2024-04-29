const Sequelize = require('sequelize');

module.exports = class Users extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      underscored: true, // true: underscored, false: camelCase
      timestamps: true, // createAt, updatedAt
      paranoid: true, // deletedAt
    });
  }

  static associate(db) {
    db.Users.hasMany(db.Comments, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'Comments' });
  }
};
