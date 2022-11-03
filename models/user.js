'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, { foreignKey: 'userId' });
    }
  }
  //TODO: Add validation
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: {
      type: DataTypes.STRING,
      unique: true,
      validate: {isEmail: true}
    },
    password: {
      type: DataTypes.STRING,
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};