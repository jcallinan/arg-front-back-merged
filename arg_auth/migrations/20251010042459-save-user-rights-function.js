'use strict';

const { getSchemaForEnv } = require('./utils/schema-map');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION "${schema}"."GetUserRights"(p_user_id INTEGER)
        RETURNS TABLE(
            "RightsId" BIGINT,
            "Name" TEXT,
            "DisplayName" VARCHAR(50),
            "Description" VARCHAR(250),
            "Url" VARCHAR(255),
            "IsNavigationItem" BOOLEAN,
            "IsVisible" BOOLEAN,
            "DisplayOrder" INTEGER,
            "ParentRightsId" BIGINT,
            RightsStatus SMALLINT,
            Source TEXT,
            HasPermission BOOLEAN
        )
        LANGUAGE sql
        AS $$
        WITH user_group_rights AS (
            -- Get rights from groups that the user belongs to
            SELECT DISTINCT
                gr."RightsId",
                r."Name",
                r."DisplayName",
                r."Description",
                r."Url",
                r."IsNavigationItem",
                r."IsVisible",
                r."DisplayOrder",
                r."ParentRightsId",
                r."Status" as RightsStatus,
                'GROUP' as Source,
                true as HasPermission
            FROM "${schema}"."UsersGroupsMappings" ugm
            INNER JOIN "${schema}"."GroupRights" gr ON ugm."GroupId" = gr."GroupId"
            INNER JOIN "${schema}"."Rights" r ON gr."RightsId" = r."RightsId"
            WHERE ugm."UserId" = p_user_id
              AND r."Status" = 1  -- Only active rights
        ),
        user_direct_rights AS (
            -- Get direct user rights (these have priority)
            SELECT DISTINCT
                ur."RightsId",
                r."Name",
                r."DisplayName",
                r."Description",
                r."Url",
                r."IsNavigationItem",
                r."IsVisible",
                r."DisplayOrder",
                r."ParentRightsId",
                r."Status" as RightsStatus,
                'USER' as Source,
                ur."IsPermission" as HasPermission
            FROM "${schema}"."UsersRights" ur
            INNER JOIN "${schema}"."Rights" r ON ur."RightsId" = r."RightsId"
            WHERE ur."UserId" = p_user_id
              AND r."Status" = 1  -- Only active rights
        ),
        combined_rights AS (
            -- Combine group and user rights, with user rights taking priority
            SELECT 
                "RightsId",
                "Name",
                "DisplayName",
                "Description",
                "Url",
                "IsNavigationItem",
                "IsVisible",
                "DisplayOrder",
                "ParentRightsId",
                RightsStatus,
                Source,
                HasPermission,
                -- User rights take priority over group rights
                CASE 
                    WHEN Source = 'USER' THEN 1
                    ELSE 2
                END as Priority
            FROM user_direct_rights
            
            UNION ALL
            
            SELECT 
                "RightsId",
                "Name",
                "DisplayName",
                "Description",
                "Url",
                "IsNavigationItem",
                "IsVisible",
                "DisplayOrder",
                "ParentRightsId",
                RightsStatus,
                Source,
                HasPermission,
                2 as Priority
            FROM user_group_rights
            WHERE "RightsId" NOT IN (
                -- Exclude rights that are already defined in user rights
                SELECT "RightsId" FROM user_direct_rights
            )
        ),
        final_rights AS (
            -- Get the final rights with user rights having priority
            SELECT DISTINCT ON ("RightsId")
                "RightsId",
                "Name",
                "DisplayName",
                "Description",
                "Url",
                "IsNavigationItem",
                "IsVisible",
                "DisplayOrder",
                "ParentRightsId",
                RightsStatus,
                Source,
                HasPermission
            FROM combined_rights
            ORDER BY "RightsId", Priority ASC
        )
        -- Final result: Only return rights where HasPermission is true and IsNavigationItem is false
        SELECT 
            "RightsId",
            "Name",
            "DisplayName",
            "Description",
            "Url",
            "IsNavigationItem",
            "IsVisible",
            "DisplayOrder",
            "ParentRightsId",
            RightsStatus,
            Source,
            HasPermission
        FROM final_rights
        WHERE HasPermission = true
        ORDER BY "DisplayOrder" ASC, "Name" ASC;
        $$;
    `);
  },

  async down(queryInterface) {
    const schema = getSchemaForEnv();

    await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS "${schema}"."GetUserRights"(INTEGER);
    `);
  }
};
