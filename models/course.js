'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a title',
        },
        notEmpty: {
          msg: 'Please provide a title',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a description',
        },
        notEmpty: {
          msg: 'Please provide a description',
        },
      },
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};