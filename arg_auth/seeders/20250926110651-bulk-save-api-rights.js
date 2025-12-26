'use strict';

const { Op } = require('sequelize');
const { RightsMap } = require('../scripts/routes-map.ts');
const { OldRouteMap } = require('../scripts/old-routes-map.ts');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    const now = new Date();

    // Import routes map data from routes-map.ts
    const routesMap = RightsMap;

    // Extract all unique access rights
    const allAccessRights = new Set();
    routesMap.forEach(route => {
      route.accessRights.forEach(right => allAccessRights.add(right));
    });

    // Find the last RightsId to start incrementing from
    const lastRightsResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("RightsId"), 0) as maxId FROM "Rights"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    const lastRightsId = parseInt(lastRightsResult[0]?.maxid || 0);

    // Generate Rights data with manual IDs starting from lastRightsId + 1
    const rightsSeed = [];
    let rightsIdCounter = lastRightsId + 1;

    Array.from(allAccessRights).forEach(accessRight => {
      // Extract display name from access right (second last word)
      const parts = accessRight.split('::');
      const displayName = parts[parts.length - 2] || accessRight;

      rightsSeed.push({
        RightsId: rightsIdCounter++,
        ParentRightsId: 0,
        IsNavigationItem: false,
        Name: accessRight,
        DisplayName: displayName,
        DisplayOrder: 0,
        Description: displayName,
        Url: null,
        IsVisible: true,
        Status: 1,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
      });
    });

    await queryInterface.bulkInsert('Rights', rightsSeed);

    // Find the last RouteId to start incrementing from
    const lastRouteResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("RouteId"), 0) as maxId FROM "RouteMaster"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    const lastRouteId = parseInt(lastRouteResult[0]?.maxid || 0);

    // Generate Route Master data with manual IDs starting from lastRouteId + 1
    const routeMasterSeed = [];
    let routeIdCounter = lastRouteId + 1;

    routesMap.forEach(route => {
      routeMasterSeed.push({
        RouteId: routeIdCounter++,
        Route: route.path,
        Method: route.method,
        Description: `${route.operationId} - ${route.method}`,
        Status: 1,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
      });
    });

    await queryInterface.bulkInsert('RouteMaster', routeMasterSeed);

    await queryInterface.sequelize.query(
      `SELECT "RightsId", "Name" FROM "Rights" WHERE "Name" IN (${Array.from(allAccessRights).map(() => '?').join(',')})`,
      {
        replacements: Array.from(allAccessRights),
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    // Fetch the inserted Route records to get their actual IDs
     await queryInterface.sequelize.query(
      `SELECT "RouteId", "Route", "Method" FROM "RouteMaster" WHERE ("Route", "Method") IN (${routesMap.map(() => '(?, ?)').join(',')})`,
      {
        replacements: routesMap.flatMap(route => [route.path, route.method]),
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    // Create maps for easy lookup using the manual IDs we just created
    const rightsMap = new Map();
    let currentRightsId = lastRightsId + 1;
    Array.from(allAccessRights).forEach(accessRight => {
      rightsMap.set(accessRight, currentRightsId++);
    });

    const routeMap = new Map();
    let currentRouteId = lastRouteId + 1;
    routesMap.forEach(route => {
      // Create a unique key combining path and method
      const routeKey = `${route.path}:${route.method}`;
      routeMap.set(routeKey, currentRouteId++);
    });

    const routeRightsMappingSeed = [];

    routesMap.forEach(route => {
      // Create a unique key combining path and method to get the correct route ID
      const routeKey = `${route.path}:${route.method}`;
      const routeId = routeMap.get(routeKey);

      route.accessRights.forEach(accessRight => {
        const rightsId = rightsMap.get(accessRight);

        // Debug: Log each mapping attempt
        // console.log(`Mapping: Route "${route.path}" (${route.method}) (ID: ${routeId}) -> Right "${accessRight}" (ID: ${rightsId})`);

        routeRightsMappingSeed.push({
          RouteId: routeId,
          RightsId: rightsId,
          Status: 1,
          CreatedBy: 0,
          CreatedOn: now,
          UpdatedOn: now,
        });
      });
    });

    // Debug: Log the final mapping seed data
    // console.log('Route Rights Mapping Seed Data:', routeRightsMappingSeed);

    await queryInterface.bulkInsert('RouteRightsMapping', routeRightsMappingSeed, {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface) {
    // Import routes map data from routes-map.ts (use same source as up method)
    const routesMap = OldRouteMap;

    // Extract all unique access rights
    const allAccessRights = new Set();

    routesMap.forEach(route => {
      route.accessRights.forEach(right => allAccessRights.add(right));
    });

    // Find Rights IDs based on Name field
    const rightsRecords = await queryInterface.sequelize.query(
      `SELECT "RightsId" FROM "Rights" WHERE "Name" IN (${Array.from(allAccessRights).map(() => '?').join(',')})`,
      {
        replacements: Array.from(allAccessRights),
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    const rightsIds = rightsRecords.map(record => record.RightsId);

    // Find Route IDs based on Route and Method fields
    const routeRecords = await queryInterface.sequelize.query(
      `SELECT "RouteId" FROM "RouteMaster" WHERE ("Route", "Method") IN (${routesMap.map(() => '(?, ?)').join(',')})`,
      {
        replacements: routesMap.flatMap(route => [route.path, route.method]),
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    const routeIds = routeRecords.map(record => record.RouteId);

    console.log('Found Rights IDs to delete:', rightsIds);
    console.log('Found Route IDs to delete:', routeIds);

    // Remove Route Rights Mapping (due to foreign key constraints)
    // Use a more comprehensive approach - delete all RouteRightsMapping records that reference our routes
    if (routeIds.length > 0) {
      const deletedRouteRightsMapping = await queryInterface.bulkDelete('RouteRightsMapping', {
        RouteId: {
          [Op.in]: routeIds
        }
      }, {});
      console.log('Deleted RouteRightsMapping records:', deletedRouteRightsMapping);
    }

    // Also remove any RouteRightsMapping records that reference our rights
    if (rightsIds.length > 0) {
      const deletedRouteRightsMappingByRights = await queryInterface.bulkDelete('RouteRightsMapping', {
        RightsId: {
          [Op.in]: rightsIds
        }
      }, {});
      console.log('Deleted additional RouteRightsMapping records by RightsId:', deletedRouteRightsMappingByRights);
    }

    // Remove Route Master data
    if (routeIds.length > 0) {
      const deletedRoutes = await queryInterface.bulkDelete('RouteMaster', {
        RouteId: {
          [Op.in]: routeIds
        }
      }, {});
      console.log('Deleted RouteMaster records:', deletedRoutes);
    }

    // Remove Rights data
    if (rightsIds.length > 0) {
      const deletedRights = await queryInterface.bulkDelete('Rights', {
        RightsId: {
          [Op.in]: rightsIds
        }
      }, {});
      console.log('Deleted Rights records:', deletedRights);
    }
  }
};
