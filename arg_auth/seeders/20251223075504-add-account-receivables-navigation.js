'use strict';

const { Op } = require('sequelize');
const { AccountReceivablesRights } = require('../access-control-config/account-receivables-rights.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Fetch maximum RightsId to ensure we start from correct index
    const maxRightsIdResult = await queryInterface.sequelize.query(
      `SELECT COALESCE(MAX("RightsId"), 0) as "maxId" FROM "Rights"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    const maxRightsId = parseInt(
      maxRightsIdResult[0]?.maxId || maxRightsIdResult[0]?.maxid || 0,
      10
    );
    let rightsIdCounter = maxRightsId + 1;

    // Step 1: Insert Account Receivables (parent is RightsId 1 - ARG Main Board)
    const accountReceivablesId = rightsIdCounter++;
    const accountReceivables = {
      RightsId: accountReceivablesId,
      ParentRightsId: 1, // ARG Main Board
      IsNavigationItem: true,
      Name: 'AR::Dashboard::R',
      DisplayName: 'Account Receivables',
      DisplayOrder: 2,
      Description: 'Manage all accounts receivables modules and customer transactions',
      Url: 'accounts-receivable',
      IsVisible: true,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      Module: 'Account Receivables'
    };

    await queryInterface.bulkInsert('Rights', [accountReceivables]);

    // Step 2: Insert modules (children of Account Receivables)
    const modules = [
      { Name: 'AR::Control-File::R', DisplayName: 'Control File', DisplayOrder: 1, Description: 'Access and manage control file settings for accounts receivables', Url: '/accounts-receivable/control-file' },
      { Name: 'AR::Customer-Maintenance::R', DisplayName: 'Customer Maintenance', DisplayOrder: 2, Description: 'Create, update and manage customer records and information', Url: '' },
      { Name: 'AR::Credit-Limit::R', DisplayName: 'Credit Limit', DisplayOrder: 3, Description: 'View and manage customer credit limits and credit terms', Url: '/accounts-receivable/credit-limit' },
      { Name: 'AR::AR-Invoices::R', DisplayName: 'AR Invoices', DisplayOrder: 4, Description: 'View, create and manage accounts receivable invoices', Url: '/accounts-receivable/ar-invoices' },
      { Name: 'AR::Cash-Receipts::R', DisplayName: 'Cash Receipts', DisplayOrder: 5, Description: 'Record and manage cash receipts and customer payments', Url: '/accounts-receivable/cash-receipts' },
      { Name: 'AR::Reports::R', DisplayName: 'Reports', DisplayOrder: 6, Description: 'Access accounts receivable reports', Url: '/accounts-receivable/ar-reports' },
    ];

    // Assign RightsIds to modules and track specific parent IDs
    let customerMaintenanceId;
    let creditLimitId;
    let arInvoicesId;
    const modulesSeed = modules.map(module => {
      const moduleRightsId = rightsIdCounter++;
      if (module.Name === 'AR::Customer-Maintenance::R') {
        customerMaintenanceId = moduleRightsId;
      } else if (module.Name === 'AR::Credit-Limit::R') {
        creditLimitId = moduleRightsId;
      } else if (module.Name === 'AR::AR-Invoices::R') {
        arInvoicesId = moduleRightsId;
      }
      return {
        RightsId: moduleRightsId,
        ParentRightsId: accountReceivablesId,
        IsNavigationItem: true,
        Name: module.Name,
        DisplayName: module.DisplayName,
        DisplayOrder: module.DisplayOrder,
        Description: module.Description,
        Url: module.Url,
        IsVisible: true,
        Status: 1,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
        Module: 'Account Receivables'
      };
    });

    await queryInterface.bulkInsert('Rights', modulesSeed);

    // Step 3: Insert sub-modules (children of Customer Maintenance)
    const customerMaintenanceSubModules = [
      { Name: 'AR::Customer-Master::R', DisplayName: 'Customer Master List', DisplayOrder: 1, Description: 'View and search the complete customer master list', Url: 'accounts-receivable/customer-maintenance/customer-master-list' },
      { Name: 'AR::Aged-Trial::R', DisplayName: 'Aged Trial Balance', DisplayOrder: 2, Description: 'View aged trial balance reports for accounts receivables', Url: 'accounts-receivable/customer-maintenance/aged-trial-balance' },
      { Name: 'AR::Salesman::R', DisplayName: 'Salesman', DisplayOrder: 3, Description: 'Manage salesman information and sales territory assignments', Url: 'accounts-receivable/customer-maintenance/salesman' },
      { Name: 'AR::CSR-Maintenance::R', DisplayName: 'CSR maintenance', DisplayOrder: 4, Description: 'Maintain customer service representative records and assignments', Url: 'accounts-receivable/customer-maintenance/csr-maintenance' },
    ];

    const customerMaintenanceSubModulesSeed = customerMaintenanceSubModules.map(subModule => ({
      RightsId: rightsIdCounter++,
      ParentRightsId: customerMaintenanceId,
      IsNavigationItem: true,
      Name: subModule.Name,
      DisplayName: subModule.DisplayName,
      DisplayOrder: subModule.DisplayOrder,
      Description: subModule.Description,
      Url: subModule.Url,
      IsVisible: true,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      Module: 'Account Receivables'
    }));

    await queryInterface.bulkInsert('Rights', customerMaintenanceSubModulesSeed);

    // Step 4: Insert sub-modules (children of Credit Limit)
    const creditLimitSubModules = [
      { Name: 'AR::Credit-Limit-Groupings::R', DisplayName: 'Credit Limit Groupings', DisplayOrder: 1, Description: 'Manage credit limit groupings', Url: 'accounts-receivable/credit-limit/credit-limit-groupings' },
      { Name: 'AR::Credit-Limit-Grouping-Report::R', DisplayName: 'Credit Limit Grouping Report', DisplayOrder: 2, Description: 'View credit limit grouping reports', Url: 'accounts-receivable/credit-limit/credit-limit-grouping-report' },
      { Name: 'AR::Credit-Limit-Auth::R', DisplayName: 'Credit Limit Authorization', DisplayOrder: 3, Description: 'Authorize credit limits', Url: 'accounts-receivable/credit-limit/credit-limit-auth' },
      { Name: 'AR::Authorize-Over-Credit-Limit::R', DisplayName: 'Authorize Over Credit Limit', DisplayOrder: 4, Description: 'Authorize over credit limit', Url: 'accounts-receivable/credit-limit/authorize-over-credit-limit' },
    ];

    const creditLimitSubModulesSeed = creditLimitSubModules.map(subModule => ({
      RightsId: rightsIdCounter++,
      ParentRightsId: creditLimitId,
      IsNavigationItem: true,
      Name: subModule.Name,
      DisplayName: subModule.DisplayName,
      DisplayOrder: subModule.DisplayOrder,
      Description: subModule.Description,
      Url: subModule.Url,
      IsVisible: true,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      Module: 'Account Receivables'
    }));

    await queryInterface.bulkInsert('Rights', creditLimitSubModulesSeed);

    // Step 5: Insert sub-modules (children of AR Invoices)
    const arInvoicesSubModules = [
      { Name: 'AR::Invoice-Inquiry::R', DisplayName: 'Invoice Inquiry', DisplayOrder: 1, Description: 'View invoices', Url: 'accounts-receivable/ar-invoices/invoice-inquiry' },
      { Name: 'AR::Invoice-History-Inquiry::R', DisplayName: 'Invoice History Inquiry', DisplayOrder: 2, Description: 'View invoice history', Url: 'accounts-receivable/ar-invoices/invoice-history-inquiry' },
      { Name: 'AR::Mobility-Statements::R', DisplayName: 'Mobility Statements', DisplayOrder: 3, Description: 'View mobility statements', Url: 'accounts-receivable/ar-invoices/mobility-statements' },
    ];

    const arInvoicesSubModulesSeed = arInvoicesSubModules.map(subModule => ({
      RightsId: rightsIdCounter++,
      ParentRightsId: arInvoicesId,
      IsNavigationItem: true,
      Name: subModule.Name,
      DisplayName: subModule.DisplayName,
      DisplayOrder: subModule.DisplayOrder,
      Description: subModule.Description,
      Url: subModule.Url,
      IsVisible: true,
      Status: 1,
      CreatedBy: 0,
      CreatedOn: now,
      UpdatedOn: now,
      Module: 'Account Receivables'
    }));

    await queryInterface.bulkInsert('Rights', arInvoicesSubModulesSeed);

    // Step 6: Insert non-navigation rights (url empty AND no IsNavigationItem flag)
    const rightsConfig = AccountReceivablesRights || {};
    const rightNames = Object.keys(rightsConfig);

    if (rightNames.length === 0) {
      return;
    }

    const nonNavigationRightsSeed = [];

    rightNames.forEach((name) => {
      const configValue = rightsConfig[name];

      // Must be an object with empty url, and IsNavigationItem not present/true
      if (!configValue || typeof configValue !== 'object') {
        return;
      }

      if (configValue.IsNavigationItem === true) {
        return;
      }

      const parts = name.split('::');
      const displayName = parts[parts.length - 2] || name;

      nonNavigationRightsSeed.push({
        RightsId: rightsIdCounter++,
        ParentRightsId: 0,
        IsNavigationItem: false,
        Name: name,
        DisplayName: displayName,
        DisplayOrder: 0,
        Description: displayName,
        Url: configValue.url ?? '',
        IsVisible: true,
        Status: 1,
        CreatedBy: 0,
        CreatedOn: now,
        UpdatedOn: now,
      });
    });

    if (nonNavigationRightsSeed.length > 0) {
      await queryInterface.bulkInsert('Rights', nonNavigationRightsSeed);
    }
  },

  async down(queryInterface) {
    const rightsConfig = AccountReceivablesRights || {};
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

    // Delete all GroupRights associated with these Rights
    await queryInterface.bulkDelete(
      'GroupRights',
      {
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );

    // Delete the Rights themselves
    await queryInterface.bulkDelete(
      'Rights',
      {
        RightsId: {
          [Op.in]: rightsIds,
        },
      },
      {}
    );
  }
};