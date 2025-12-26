'use strict';

const { Op } = require("sequelize")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    const now = new Date();

    // 1. Fetch all Account Payables navigation rights (seeded with IDs 1–22)
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId", "DisplayName"
       FROM "Rights"
       WHERE "RightsId" BETWEEN 1 AND 22`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    // 2. Fetch target groups (1–5)
    const groups = await queryInterface.sequelize.query(
      `SELECT "GroupId"
       FROM "Group"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    // GroupId is BIGINT in DB; raw queries may return it as a string.
    // Normalize to numbers so includes() with [1,2,3,4,5] works correctly.
    const groupIds = groups.map(g => Number(g.GroupId));

    // Safety: ensure groups 1–5 exist
    const requiredGroups = [1, 2, 3, 4, 5];
    const missingGroups = requiredGroups.filter(id => !groupIds.includes(id));
    if (missingGroups.length > 0) {
      throw new Error(
        `Missing required GroupIds for AP navigation seeding: ${missingGroups.join(
          ", "
        )}`
      );
    }

    // Rights to *exclude* for Group 5
    const EXCLUDED_FOR_GROUP5 = [
      "Payment Cycle",
      "Vendor File Maintenance (1099)",
      "Year-End 1099 Process",
      "Update 1099 File",
      "A/P Maintenance",
      "Auth Generate",
    ];

    const AUTH_GENERATE_NAME = "Auth Generate";

    // Helper to decide if a given right should be assigned to a given group
    const shouldAssignRightToGroup = (groupId, rightDisplayName) => {
      // "Auth Generate" is only for Group 1 and Group 2
      if (rightDisplayName === AUTH_GENERATE_NAME) {
        return groupId === 1 || groupId === 2;
      }

      // Group 5: exclude specific rights
      if (groupId === 5 && EXCLUDED_FOR_GROUP5.includes(rightDisplayName)) {
        return false;
      }

      // Default: allow
      return true;
    };

    // 3. Determine starting GroupRightId
    const lastGroupRightResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("GroupRightId"), 0) AS "maxId" FROM "GroupRights"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const lastGroupRightId = parseInt(
      lastGroupRightResult[0]?.maxId || lastGroupRightResult[0]?.maxid || 0,
      10
    );

    // 4. Build GroupRights seed
    const groupRightsSeed = [];
    let groupRightIdCounter = lastGroupRightId + 1;

    rights.forEach((right) => {
      requiredGroups.forEach((groupId) => {
        if (!shouldAssignRightToGroup(groupId, right.DisplayName)) {
          return;
        }

        groupRightsSeed.push({
          GroupRightId: groupRightIdCounter++,
          GroupId: groupId,
          RightsId: right.RightsId,
          CreatedBy: 0,
          CreatedOn: now,
          UpdatedOn: now,
        });
      });
    });

    if (groupRightsSeed.length > 0) {
      await queryInterface.bulkInsert("GroupRights", groupRightsSeed, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    // Reverse the mappings we created in up()

    // Rebuild the same rights set (IDs 1–22 from AP navigation seeder)
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId"
       FROM "Rights"
       WHERE "RightsId" BETWEEN 1 AND 22`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const rightsIds = rights.map(r => r.RightsId);
    const targetGroups = [1, 2, 3, 4, 5];

    if (rightsIds.length === 0) {
      return;
    }

    await queryInterface.bulkDelete(
      "GroupRights",
      {
        GroupId: {
          [Op.in]: targetGroups,
        },
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );
  }

};


