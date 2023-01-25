'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Games}) {
      // define association here
      this.hasMany(Games, {
        foreignKey: 'category_game',
        onDelete: 'cascade',
        hooks: true
      });
    }
  }
  Categories.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
   }
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};