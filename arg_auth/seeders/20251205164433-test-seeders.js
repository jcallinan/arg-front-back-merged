'use strict';

const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const groupSeed = {
      GroupId: 6,
      Name: 'Test Group',
      Description: 'Test Group Description',
      AppId: 10,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      UpdatedBy: null
    };

    await queryInterface.bulkInsert('Group', [groupSeed]);
  },

  async down(queryInterface, Sequelize) {
    // Remove the group with GroupId 6
    await queryInterface.bulkDelete(
      'Group',
      {
        GroupId: {
          [Op.eq]: 6,
        },
      },
      {}
    );
  }
};
