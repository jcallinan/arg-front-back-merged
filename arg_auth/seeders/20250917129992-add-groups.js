'use strict';

const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    const now = new Date();

    const groupsSeed = [
      { GroupId: 1, Name: 'App Admin', Description: 'App Admin', AppId: 10, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { GroupId: 2, Name: 'Ap Admin', Description: 'Ap Admin', AppId: 10, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { GroupId: 3, Name: 'Ap Clerk Pitt', Description: 'Ap Clerk Pitt', AppId: 10, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { GroupId: 4, Name: 'AP Read Only', Description: 'AP Read Only', AppId: 10, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },  
      { GroupId: 5, Name: 'AP Clerk Brad', Description: 'AP Clerk Brad', AppId: 10, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
    ]

    await queryInterface.bulkInsert('Group', groupsSeed);
  },

  async down(queryInterface) {
    // Remove all groups that were seeded in up()
    await queryInterface.bulkDelete(
      'Group',
      {
        GroupId: {
          [Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {}
    );
  }
};


