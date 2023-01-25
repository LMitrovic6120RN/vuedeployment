'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cart, Games}) {
      // define association here
      this.belongsTo(Cart, {
        foreignKey: 'cart_item',
      });
      this.belongsTo(Games, {
        foreignKey: 'game_item',
      });
    }
  }
  Items.init({
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    game: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};