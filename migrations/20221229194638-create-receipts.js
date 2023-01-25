'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Receipts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      issuedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date().toISOString().slice(0, 19).replace('T', ' ')
      },
      total: {
        type: Sequelize.INTEGER
      },
      cart_receipt: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_receipt: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Receipts');
  }
};