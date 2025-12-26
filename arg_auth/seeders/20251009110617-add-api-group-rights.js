'use strict';

const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // 1. Fetch target groups (1–5)
    const groups = await queryInterface.sequelize.query(
      `SELECT "GroupId"
       FROM "Group"
       WHERE "GroupId" BETWEEN 1 AND 5`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    // GroupId is BIGINT; normalize to numbers so includes() with [1,2,3,4,5] works.
    const groupIds = groups.map((g) => Number(g.GroupId));
    const requiredGroups = [1, 2, 3, 4, 5];
    const missingGroups = requiredGroups.filter((id) => !groupIds.includes(id));

    if (missingGroups.length > 0) {
      throw new Error(
        `Missing required GroupIds for API rights seeding: ${missingGroups.join(
          ", "
        )}`
      );
    }

    // 2. Fetch all non-navigation rights (API rights)
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId", "Name"
       FROM "Rights"
       WHERE "IsNavigationItem" = false`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (rights.length === 0) {
      return;
    }

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

    const groupRightsSeed = [];
    let groupRightIdCounter = lastGroupRightId + 1;


    // Helper checks for module grouping
    const isAuthGenerateModule = (rightName) =>
      rightName.includes("auth-generate");

    const isPaymentCycleModule = (rightName) =>
      rightName.includes("payment-cycle");

    const isApPeriodEndModule = (rightName) =>
      rightName.includes("ap-period-end");

    const isApMaintenanceModule = (rightName) =>
      rightName.includes("ap-maintenance");

    // Auth Code / Auth Generate API rights that must NOT be added to Group 3 or Group 5
    const excludedGroup5Rights = new Set([
      "global-states::general-system-company::companyNo::rw",
      "global-states::general-system-company::companyNo::auth-code::r",
      "global-states::general-system-company::companyNo::r",
      "vendor-management::rw",
      "vendor-management::owner::rw",
      "voucher-maintenance::transfer::rw",
      "voucher-maintenance::discount::rw",
      "voucher-maintenance::status::rw", 
      "account-payable::voucher::flexi::upload::rw",
      "account-payable::voucher::sogas::upload::rw",
      "payment::selection::type::rw",
      "payment::selection::payment-vendor::rw",
      "account-payable::voucher::flexi::entries::r",
      "account-payable::voucher::sogas::entries::r",
    ]);

    // Rights that must be excluded from Group 4 even if they are read-only (::r)
    const excludedGroup4Rights = new Set([
      "global-states::general-system-company::companyNo::auth-code::r",
      "global-states::general-system-company::companyNo::r",
    ]);

    rights.forEach((right) => {
      const name = right.Name;

      // Groups 1, 2, 3: all non-navigation rights except Auth Generate module
      // For Group 3 specifically, also exclude the explicit Auth Generate API rights listed above
      if (!isAuthGenerateModule(name)) {
        // Groups 1 and 2: unchanged behavior
        [1, 2].forEach((groupId) => {
          groupRightsSeed.push({
            GroupRightId: groupRightIdCounter++,
            GroupId: groupId,
            RightsId: right.RightsId,
            CreatedBy: 0,
            CreatedOn: now,
            UpdatedOn: now,
          });
        });

        // Group 3: add all rights except the explicitly excluded Auth Code API rights
        if (!excludedGroup4Rights.has(name)) {
          groupRightsSeed.push({
            GroupRightId: groupRightIdCounter++,
            GroupId: 3,
            RightsId: right.RightsId,
            CreatedBy: 0,
            CreatedOn: now,
            UpdatedOn: now,
          });
        }
      }

      // Group 4: only rights that end with ::r (read-only) and are not explicitly excluded
      if (name.endsWith("::r") && !excludedGroup4Rights.has(name)) {

        groupRightsSeed.push({
          GroupRightId: groupRightIdCounter++,
          GroupId: 4,
          RightsId: right.RightsId,
          CreatedBy: 0,
          CreatedOn: now,
          UpdatedOn: now,
        });
      }

      // Group 5: all non-navigation rights except payment-related modules, Auth Generate, and explicit Auth Code rights
      if (
        !isPaymentCycleModule(name) &&
        !isApPeriodEndModule(name) &&
        !isApMaintenanceModule(name) &&
        !isAuthGenerateModule(name) &&
        !excludedGroup5Rights.has(name)
      ) {
        groupRightsSeed.push({
          GroupRightId: groupRightIdCounter++,
          GroupId: 5,
          RightsId: right.RightsId,
          CreatedBy: 0,
          CreatedOn: now,
          UpdatedOn: now,
        });
      }
    });


    // Shared API rights that must always be available to Group 5
    const sharedApiRights = ["ap-maintenance::company::r"];

    const sharedRights = rights.filter((r) => sharedApiRights.includes(r.Name));

    sharedRights.forEach((right) => {
      groupRightsSeed.push({
        GroupRightId: groupRightIdCounter++,
        GroupId: 5,
        RightsId: right.RightsId,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
      });
    });

    if (groupRightsSeed.length > 0) {
      await queryInterface.bulkInsert("GroupRights", groupRightsSeed, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    // Rebuild the same non-navigation rights set and remove mappings for Groups 1–5
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId", "Name"
       FROM "Rights"
       WHERE "IsNavigationItem" = false`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (rights.length === 0) {
      return;
    }

    const rightsForGroups123 = new Set();
    const rightsForGroup4 = new Set();
    const rightsForGroup5 = new Set();

    // Shared API rights that must always be removed from Group 5 in down
    const sharedApiRights = ["ap-maintenance::company::r"];

    const isAuthGenerateModule = (rightName) =>
      rightName.includes("general-system-company");

    const isPaymentCycleModule = (rightName) =>
      rightName.includes("payment-cycle");

    const isApPeriodEndModule = (rightName) =>
      rightName.includes("ap-period-end");

    const isApMaintenanceModule = (rightName) =>
      rightName.includes("ap-maintenance");

    rights.forEach((right) => {
      const name = right.Name;
      const id = right.RightsId;

      // Groups 1–3: all non-nav rights except Auth Generate
      if (!isAuthGenerateModule(name)) {
        rightsForGroups123.add(id);
      }

      // Group 4: only ::r
      if (name.endsWith("::r")) {
        rightsForGroup4.add(id);
      }

      // Group 5: all non-nav rights except specific payment modules and Auth Generate
      if (
        !isPaymentCycleModule(name) &&
        !isApPeriodEndModule(name) &&
        !isApMaintenanceModule(name) &&
        !isAuthGenerateModule(name)
      ) {
        rightsForGroup5.add(id);
      }

      // Ensure shared API rights are also included for Group 5 cleanup
      if (sharedApiRights.includes(name)) {
        rightsForGroup5.add(id);
      }
    });

    const idsForGroups123 = Array.from(rightsForGroups123);
    const idsForGroup4 = Array.from(rightsForGroup4);
    const idsForGroup5 = Array.from(rightsForGroup5);

    if (idsForGroups123.length > 0) {
      await queryInterface.bulkDelete(
        "GroupRights",
        {
          GroupId: {
            [Op.in]: [1, 2, 3],
          },
          RightsId: {
            [Op.in]: idsForGroups123,
          },
        },
        {}
      );
    }

    if (idsForGroup4.length > 0) {
      await queryInterface.bulkDelete(
        "GroupRights",
        {
          GroupId: 4,
          RightsId: {
            [Op.in]: idsForGroup4,
          },
        },
        {}
      );
    }

    if (idsForGroup5.length > 0) {
      await queryInterface.bulkDelete(
        "GroupRights",
        {
          GroupId: 5,
          RightsId: {
            [Op.in]: idsForGroup5,
          },
        },
        {}
      );
    }
  },
};
