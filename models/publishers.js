'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publishers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Games}) {
      // define association here
      this.hasMany(Games, {
        foreignKey: 'publisher_game',
        onDelete: 'cascade',
        hooks: true
      });
    }
  }
  Publishers.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Publishers',
  });
  return Publishers;
};