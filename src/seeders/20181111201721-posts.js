'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('posts', [
    {
      title: "Teste2",
      content: "Content2",
      author: 2,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      title: "My new post 2",
      content: "Lorem ipsum dolor",
      author: 2,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      title: "My new post",
      content: "Lorem ipsum dolor",
      author: 2,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      title: "My changed post 2",
      content: "Lorem ipsum dolor new",
      author: 2,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      title: "My changed post",
      content: "Lorem ipsum dolor new",
      author: 2,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('posts', null, {});
  }
};
