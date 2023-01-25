'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users, Games}) {
      // define association here
      this.belongsTo(Users, {
        foreignKey: 'user_review'
      });
      this.belongsTo(Games, {
        foreignKey: 'game_review',
      });
    }
  }
  Reviews.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(2048)
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};