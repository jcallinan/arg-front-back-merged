'use strict';

const { getSchemaForEnv } = require('./utils/schema-map');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION "${schema}"."UserRights"(
            p_route text,
            p_method text,
            p_user_id integer
        )
        RETURNS TABLE(
            "Route" text,
            "Method" text,
            "Name" text,
            "Value" boolean
        )
        LANGUAGE sql
        AS $$
        WITH
        params AS (
          SELECT p_route::text AS route, p_method::text AS method, p_user_id::int AS user_id
        ),
        user_groups AS (
          SELECT "GroupId"
          FROM "${schema}"."UsersGroupsMappings"
          WHERE "UserId" = (SELECT user_id FROM params)
        ),
        group_rights_for_user AS (
          SELECT DISTINCT "RightsId"
          FROM "${schema}"."GroupRights" gr
          WHERE gr."GroupId" IN (SELECT "GroupId" FROM user_groups)
        ),
        user_overrides AS (
          SELECT "RightsId", "IsPermission"
          FROM "${schema}"."UsersRights"
          WHERE "UserId" = (SELECT user_id FROM params)
        ),
        route_match AS (
          SELECT rm."RouteId"
          FROM "${schema}"."RouteMaster" rm
          WHERE rm."Route" = (SELECT route FROM params)
            AND rm."Method" = (SELECT method FROM params)
            AND rm."Status" = 1
          LIMIT 1
        ),
        route_mapped_rights AS (
          SELECT rrm."RightsId"
          FROM "${schema}"."RouteRightsMapping" rrm
          WHERE rrm."Status" = 1
            AND rrm."RouteId" IN (SELECT "RouteId" FROM route_match)
        ),
        rights_lookup AS (
          SELECT r."RightsId", r."Name"
          FROM "${schema}"."Rights" r
          JOIN route_mapped_rights rm ON rm."RightsId" = r."RightsId"
        )
        SELECT
          (SELECT route FROM params) AS "Route",
          (SELECT method FROM params) AS "Method",
          rl."Name"                  AS "Name",
          CASE
            WHEN rl."RightsId" IS NULL THEN FALSE
            ELSE COALESCE(
                  uo."IsPermission",
                  EXISTS (
                    SELECT 1 FROM group_rights_for_user g
                    WHERE g."RightsId" = rl."RightsId"
                  ),
                  FALSE
                )
          END AS "Value"
        FROM rights_lookup rl
        LEFT JOIN user_overrides uo ON uo."RightsId" = rl."RightsId"
        ORDER BY rl."Name";
        $$;
    `);
  },

  async down(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS "${schema}"."UserRights"(text, text, Integer);
    `);
  }
};
