'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', 
   [
    {id:"100",username:"administrator",password:await bcrypt.hash("administrator" ,10),email:"administrator@gameshop.rs",admin:true,moderator:true,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"101",username:"moderator",password:await bcrypt.hash("moderator", 10),email:"moderator@gameshop.rs",admin:false,moderator:true,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"102",username:"user1",password:await bcrypt.hash("useruser", 10),email:"user1@gameshop.rs",admin:false,moderator:false,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"103",username:"user2",password:await bcrypt.hash("useruser", 10),email:"user2@gameshop.rs",admin:false,moderator:false,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"104",username:"user3",password:await bcrypt.hash("useruser", 10),email:"user3@gameshop.rs",admin:false,moderator:false,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"105",username:"user4",password:await bcrypt.hash("useruser", 10),email:"user4@gameshop.rs",admin:false,moderator:false,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')},
    {id:"106",username:"luka",password:await bcrypt.hash("lukaluka", 10),email:"luka@gameshop.rs",admin:false,moderator:false,createdAt:new Date().toISOString().slice(0, 19).replace('T', ' '),updatedAt:new Date().toISOString().slice(0, 19).replace('T', ' ')}
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
