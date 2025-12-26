'use strict';

const { AccountReceivablesRights } = require('../access-control-config/account-receivables-rights.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const rightsConfig = AccountReceivablesRights || {};
    const rightNames = Object.keys(rightsConfig);

    if (rightNames.length === 0) {
      return;
    }

    // Fetch maximum GroupRightId to ensure we start from correct index
    const maxGroupRightIdResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("GroupRightId"), 0) as maxId FROM "GroupRights"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    // Postgres returns unquoted aliases in lowercase; fall back to either key
    const maxGroupRightId = parseInt(
      maxGroupRightIdResult?.[0]?.maxId ??
        maxGroupRightIdResult?.[0]?.maxid ??
        0
    );
    let groupRightIdCounter = maxGroupRightId + 1;

    // Ensure the rights exist and fetch their IDs by name
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

    const missing = rightNames.filter((name) => !rightsMap.has(name));
    if (missing.length > 0) {
      throw new Error(
        `Missing rights for Account Receivables: ${missing.join(
          ', '
        )}. Please run the Account Receivables navigation rights seeder first.`
      );
    }

    // Generate GroupRights entries for configured groups (all are GroupId 7 per config)
    const groupRightsSeed = [];

    rightNames.forEach((name) => {
      const rightsId = rightsMap.get(name);
      const configValue = rightsConfig[name];

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

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;

    const rightsConfig = AccountReceivablesRights || {};
    const rightNames = Object.keys(rightsConfig);

    if (rightNames.length === 0) {
      return;
    }

    const placeholders = rightNames.map(() => '?').join(',');
    const rights = await queryInterface.sequelize.query(
      `SELECT "RightsId", "Name"
       FROM "Rights"
       WHERE "Name" IN (${placeholders})`,
      {
        replacements: rightNames,
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (!rights || rights.length === 0) {
      return;
    }

    const rightsIds = rights.map((r) => r.RightsId);

    // Collect all group IDs defined for the rights
    const groupIds = new Set();
    rightNames.forEach((name) => {
      const configValue = rightsConfig[name];
      if (Array.isArray(configValue)) {
        configValue.forEach((g) => groupIds.add(g));
      } else if (
        configValue &&
        typeof configValue === 'object' &&
        Array.isArray(configValue.groups)
      ) {
        configValue.groups.forEach((g) => groupIds.add(g));
      }
    });

    if (groupIds.size === 0) {
      return;
    }

    await queryInterface.bulkDelete(
      'GroupRights',
      {
        GroupId: { [Op.in]: Array.from(groupIds) },
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );
  },
};
