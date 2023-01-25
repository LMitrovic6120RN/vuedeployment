'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Receipts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cart, Users}) {
      // define association here
      this.belongsTo(Cart, {
        foreignKey: 'cart_receipt',
      });
      this.belongsTo(Users, {
        foreignKey: 'user_receipt'
      });
    }
  }
  Receipts.init({
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date().toISOString().slice(0, 19).replace('T', ' ')
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Receipts',
  });
  return Receipts;
};