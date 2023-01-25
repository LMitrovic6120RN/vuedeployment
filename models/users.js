'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Reviews, Wishlist, Cart, Receipts, Payments}) {
      // define association here
      this.hasMany(Reviews, {
        foreignKey: 'user_review',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Wishlist, {
        foreignKey: 'user_wishlist',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Cart, {
        foreignKey: 'user_cart',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Receipts, {
        foreignKey: 'user_receipt',
        onDelete: 'cascade',
        hooks: true
      });
      this.hasMany(Payments, {
        foreignKey: 'user_payment',
        onDelete: 'cascade',
        hooks: true
      });
    }
    /*
    static associate({Wishlist}){
      this.hasMany(Wishlist, {
        foreignKey: 'user_wl',
        onDelete: 'cascade',
        hooks: true
      });
    }
    static associate({Cart}){
      this.hasMany(Cart, {
        foreignKey: 'user_cart',
        onDelete: 'cascade',
        hooks: true
      });
    }
    static associate({Receipts}){
      this.hasMany(Receipts, {
        foreignKey: 'user_rcp',
        onDelete: 'cascade',
        hooks: true
      });
    }*/
  }
  Users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    moderator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Nije email"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};