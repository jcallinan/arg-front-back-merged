'use strict';

const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const groupSeed = {
      GroupId: 7,
      Name: 'AR Group',
      Description: 'AR Group',
      AppId: 10,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      UpdatedBy: null
    };

    await queryInterface.bulkInsert('Group', [groupSeed]);
  },

  async down(queryInterface) {
    // Remove the group with GroupId 6
    await queryInterface.bulkDelete(
      'Group',
      {
        GroupId: {
          [Op.eq]: 7,
        },
      },
      {}
    );
  }
};
