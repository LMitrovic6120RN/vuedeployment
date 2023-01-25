'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
     static associate({Users, Items, Receipts}){
      this.belongsTo(Users, {
        foreignKey: 'user_cart'
      });
      this.hasMany(Items, {
        foreignKey: 'cart_item',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasOne(Receipts, {
        foreignKey: 'cart_receipt',
        onDelete: 'cascade',
        hooks: true
      });
    }
  }
  Cart.init({
    to_pay: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};