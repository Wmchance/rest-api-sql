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
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a first name',
        },
        notEmpty: {
          msg: 'Please provide a first name',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a last name',
        },
        notEmpty: {
          msg: 'Please provide a last name',
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Username already exists. Please chose a new username',
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
        notNull: {
          msg: 'Please provide a email address',
        },
        notEmpty: {
          msg: 'Please provide a email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a password',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hashSync(user.password, 10);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};

