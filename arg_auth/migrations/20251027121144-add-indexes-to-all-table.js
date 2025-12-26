'use strict';

const { getSchemaForEnv } = require('./utils/schema-map');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const schema = getSchemaForEnv();

    // Add indexes to User table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_id" ON "${schema}"."User" USING btree ("UserId");
    `);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_email" ON "${schema}"."User" USING btree ("Email");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_token" ON "${schema}"."User" USING btree ("RefreshToken");
    `);

    // Add indexes to UsersRights table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_rights_user" ON "${schema}"."UsersRights" USING btree ("UserId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_rights_right" ON "${schema}"."UsersRights" USING btree ("RightsId");
    `);

    // Add indexes to UsersGroupsMappings table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_group_user" ON "${schema}"."UsersGroupsMappings" USING btree ("UserId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_group_group" ON "${schema}"."UsersGroupsMappings" USING btree ("GroupId");
    `);

    // Add indexes to Group table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_group_name" ON "${schema}"."Group" USING btree ("Name");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_group_status" ON "${schema}"."Group" USING btree ("Status");
    `);

    // Add indexes to GroupRights table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_group_rights_group" ON "${schema}"."GroupRights" USING btree ("GroupId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_group_rights_right" ON "${schema}"."GroupRights" USING btree ("RightsId");
    `);

    // Add indexes to LoginHistories table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_login_user" ON "${schema}"."LoginHistories" USING btree ("UserId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_login_active" ON "${schema}"."LoginHistories" USING btree ("IsActive");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_login_status" ON "${schema}"."LoginHistories" USING btree ("LoginStatus");
    `);

    // Add indexes to Rights table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_rights_parent" ON "${schema}"."Rights" USING btree ("ParentRightsId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_rights_status" ON "${schema}"."Rights" USING btree ("Status");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_rights_nav" ON "${schema}"."Rights" USING btree ("IsNavigationItem");
    `);

    // Add indexes to RouteMaster table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_route_path" ON "${schema}"."RouteMaster" USING btree ("Route");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_route_method" ON "${schema}"."RouteMaster" USING btree ("Method");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_route_status" ON "${schema}"."RouteMaster" USING btree ("Status");
    `);

    // Add indexes to RouteRightsMapping table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_route_rights_route" ON "${schema}"."RouteRightsMapping" USING btree ("RouteId");
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_route_rights_right" ON "${schema}"."RouteRightsMapping" USING btree ("RightsId");
    `);
  },

  async down(queryInterface) {
    const schema = getSchemaForEnv();

    // Drop indexes in reverse order
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_route_rights_right";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_route_rights_route";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_route_status";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_route_method";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_route_path";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_rights_nav";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_rights_status";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_rights_parent";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_login_status";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_login_active";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_login_user";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_group_rights_right";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_group_rights_group";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_group_status";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_group_name";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_group_group";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_group_user";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_rights_right";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_rights_user";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_token";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_email";`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${schema}"."idx_user_id";`);
  }
};

