'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Categories, Publishers, Items, Reviews, Wishlist}) {
      // define association here
      this.belongsTo(Categories, {
        foreignKey: 'category_game'
        });
      this.belongsTo(Publishers, {
        foreignKey: 'publisher_game'
      });
      this.hasMany(Items, {
        foreignKey: 'game_item',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Reviews, {
        foreignKey: 'game_review',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Wishlist, {
        foreignKey: 'game_wishlist',
        onDelete: 'cascade',
        hooks: true
      });
    }
  }
  Games.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
   },
    info: {
      type: DataTypes.STRING(2048)
    }
  }, {
    sequelize,
    modelName: 'Games',
  });
  return Games;
};