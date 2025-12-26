'use strict';

const { getSchemaForEnv } = require('./utils/schema-map');

module.exports = {
  async up(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
     CREATE OR REPLACE FUNCTION "${schema}"."UserNavigation"(p_user_id INTEGER)
RETURNS TABLE(
    "RightsId" BIGINT,
    "ParentRightsId" BIGINT,
    "DisplayName" VARCHAR(50),
    "Name" TEXT,
    "Url" VARCHAR(255),
    "IsNavigationItem" BOOLEAN,
    "DisplayOrder" INTEGER,
    level INTEGER,
    path BIGINT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE nav_tree AS (
        SELECT
            r."RightsId",
            r."ParentRightsId",
            r."DisplayName",
            r."Name",
            r."Url",
            r."IsNavigationItem",
            r."DisplayOrder",
            1 AS level,
            ARRAY[r."RightsId"] AS path
        FROM "${schema}"."Rights" r
        WHERE r."Name" = 'ARG::read'
          AND r."Status" = 1
          AND r."IsVisible" = true

        UNION ALL

        SELECT
            c."RightsId",
            c."ParentRightsId",
            c."DisplayName",
            c."Name",
            c."Url",
            c."IsNavigationItem",
            c."DisplayOrder",
            nt.level + 1,
            nt.path || c."RightsId"
        FROM "${schema}"."Rights" c
        INNER JOIN nav_tree nt ON nt."RightsId" = c."ParentRightsId"
        WHERE c."Status" = 1
          AND c."IsVisible" = true
    ),
    user_group_rights AS (
        SELECT DISTINCT gr."RightsId" AS group_right_id
        FROM "${schema}"."UsersGroupsMappings" ugm
        INNER JOIN "${schema}"."GroupRights" gr ON gr."GroupId" = ugm."GroupId"
        WHERE ugm."UserId" = p_user_id
    ),
    user_direct_rights AS (
        SELECT ur."RightsId" AS direct_right_id
        FROM "${schema}"."UsersRights" ur
        WHERE ur."UserId" = p_user_id
          AND ur."IsPermission" = true
    )
    SELECT
        nt."RightsId",
        nt."ParentRightsId",
        nt."DisplayName",
        nt."Name",
        nt."Url",
        nt."IsNavigationItem",
        nt."DisplayOrder",
        nt.level,
        nt.path
    FROM nav_tree nt
    WHERE nt."IsNavigationItem" = true
      AND (
        nt."RightsId" IN (SELECT ugr.group_right_id FROM user_group_rights ugr)
        OR nt."RightsId" IN (SELECT udr.direct_right_id FROM user_direct_rights udr)
      )
    ORDER BY nt.path, nt."DisplayOrder";
END;
$$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS "${schema}"."UserNavigation"(Integer);
    `);
  }
};
