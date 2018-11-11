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
   return queryInterface.bulkInsert('comments', [{
    comment: 'This is a comment',
    post: 1,
    user: 1,
    createdAt: '2018-11-02 22:08:35.813-03',
    updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      comment: 'This is a comment',
      post: 1,
      user: 1,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
    },
    {
      comment: 'This is a comment',
      post: 2,
      user: 1,
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'      
      },
      {
        comment: 'This is a comment',
        post: 2,
        user: 1,
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
  }
};
