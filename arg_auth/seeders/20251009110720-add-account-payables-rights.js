'use strict';

const { Op } = require('sequelize');
const { AccountPayablesRights } = require('../access-control-config/account-payables-rights.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const rightsConfig = AccountPayablesRights || {};
    const rightNames = Object.keys(rightsConfig);

    if (rightNames.length === 0) {
      return;
    }

    // 1. Ensure Groups 1–5 exist
    const groups = await queryInterface.sequelize.query(
      `SELECT "GroupId"
       FROM "Group"
       WHERE "GroupId" BETWEEN 1 AND 5`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const existingGroupIds = groups.map((g) => Number(g.GroupId));
    const requiredGroups = [1, 2, 3, 4, 5];
    const missingGroups = requiredGroups.filter(
      (id) => !existingGroupIds.includes(id)
    );

    if (missingGroups.length > 0) {
      throw new Error(
        `Missing required GroupIds for Account Payables rights seeding: ${missingGroups.join(
          ', '
        )}`
      );
    }

    // 2. Fetch maximum RightsId (rights max length)
    const lastRightsResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("RightsId"), 0) AS "maxId" FROM "Rights"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const lastRightsId = parseInt(
      lastRightsResult[0]?.maxId || lastRightsResult[0]?.maxid || 0,
      10
    );

    // 3. Fetch maximum GroupRightId (GroupRights max length)
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

    // 4. Find existing rights for these names
    const placeholders = rightNames.map(() => '?').join(',');
    const existingRights = await queryInterface.sequelize.query(
      `SELECT "RightsId", "Name"
       FROM "Rights"
       WHERE "Name" IN (${placeholders})`,
      {
        replacements: rightNames,
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const rightsMap = new Map();
    existingRights.forEach((r) => rightsMap.set(r.Name, r.RightsId));

    // 5. Insert missing Rights records
    const rightsSeed = [];
    let currentRightsId = lastRightsId + 1;

    rightNames.forEach((name) => {
      if (rightsMap.has(name)) {
        return;
      }

      const parts = name.split('::');
      const displayName = parts[parts.length - 2] || name;

      // Support both legacy array format and new object format with { groups, url }
      const configValue = rightsConfig[name];
      let url = '';

      if (
        configValue &&
        !Array.isArray(configValue) &&
        typeof configValue === 'object' &&
        typeof configValue.url === 'string' &&
        configValue.url.trim() !== ''
      ) {
        url = configValue.url.trim();
      }

      const rightsId = currentRightsId++;
      rightsMap.set(name, rightsId);

      rightsSeed.push({
        RightsId: rightsId,
        ParentRightsId: 0,
        IsNavigationItem: false,
        Name: name,
        DisplayName: displayName,
        DisplayOrder: 0,
        Description: displayName,
        Url: url,
        IsVisible: true,
        Status: 1,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
      });
    });

    if (rightsSeed.length > 0) {
      await queryInterface.bulkInsert('Rights', rightsSeed);
    }

    // 6. Insert GroupRights based on config values
    const groupRightsSeed = [];
    let groupRightIdCounter = lastGroupRightId + 1;

    rightNames.forEach((name) => {
      const rightsId = rightsMap.get(name);
      const configValue = rightsConfig[name];

      // Derive the list of groups from either:
      // - legacy format: [1,2,3]
      // - new format: { groups: [1,2,3], url: '' }
      let groupList = [];

      if (Array.isArray(configValue)) {
        groupList = configValue;
      } else if (
        configValue &&
        typeof configValue === 'object' &&
        Array.isArray(configValue.groups)
      ) {
        groupList = configValue.groups;
      }

      groupList.forEach((groupId) => {
        // Only allow configured groups 1–5
        if (!requiredGroups.includes(groupId)) {
          return;
        }

        groupRightsSeed.push({
          GroupRightId: groupRightIdCounter++,
          GroupId: groupId,
          RightsId: rightsId,
          CreatedBy: 0,
          CreatedOn: now,
          UpdatedOn: now,
        });
      });
    });

    if (groupRightsSeed.length > 0) {
      await queryInterface.bulkInsert('GroupRights', groupRightsSeed, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    const rightsConfig = AccountPayablesRights || {};
    const rightNames = Object.keys(rightsConfig);

    if (rightNames.length === 0) {
      return;
    }

    const placeholders = rightNames.map(() => '?').join(',');
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId"
       FROM "Rights"
       WHERE "Name" IN (${placeholders})`,
      {
        replacements: rightNames,
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const rightsIds = rights.map((r) => r.RightsId);

    if (rightsIds.length === 0) {
      return;
    }

    // 1. Delete all GroupRights associated with these Rights
    await queryInterface.bulkDelete(
      'GroupRights',
      {
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );

    // 2. Delete the Rights themselves
    await queryInterface.bulkDelete(
      'Rights',
      {
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );
  },
};

