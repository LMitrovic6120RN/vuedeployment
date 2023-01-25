'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users, Games}) {
      // define association here
      this.belongsTo(Users, {
        foreignKey: 'user_wishlist'
      });
      this.belongsTo(Games, {
        foreignKey: 'game_wishlist'
      });
    }
  }
  Wishlist.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};