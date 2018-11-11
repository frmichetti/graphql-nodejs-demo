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
   
    /*Password 1234*/
   return queryInterface.bulkInsert('users', [{
      name: "Felipe",
      email: "felipe@gmail.com",
      password: "$2a$10$rfkkF6rQEFq8Z5LTPjhHg.rjUAAGK0Qv6J4o7wgXGnrk7/RPUd/Ny",
      createdAt: '2018-11-02 22:08:35.813-03',
      updatedAt: '2018-11-02 22:08:35.813-03'
    }, 
    {
    name: "Teste",
    email: "teste@email.com",
    password: "$2a$10$rfkkF6rQEFq8Z5LTPjhHg.rjUAAGK0Qv6J4o7wgXGnrk7/RPUd/Ny",
    createdAt: '2018-11-02 22:08:35.813-03',
    updatedAt: '2018-11-02 22:08:35.813-03'
  },], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('users', null, {});
  }
};
