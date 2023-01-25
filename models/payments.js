'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users}) {
      // define association here
      this.belongsTo(Users, {
        foreignKey: 'user_payment'
      });
    }
  }
  Payments.init({
    payments_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_payments: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payments',
  });
  return Payments;
};