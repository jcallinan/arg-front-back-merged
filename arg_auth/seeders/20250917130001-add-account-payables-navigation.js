'use strict';

const { Op } = require("sequelize")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const rightsSeed = [
      { RightsId: 1, ParentRightsId: null, IsNavigationItem: true, Name: 'ARG::read', DisplayName: 'Dashboard', DisplayOrder: 1, Description: 'Main Dashboard for ARG system', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 2, ParentRightsId: 1, IsNavigationItem: true, Name: 'account_payable::read', DisplayName: 'Account Payables', DisplayOrder: 1, Description: 'Manage all accounts payable modules', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 3, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::voucher-management::read', DisplayName: 'Voucher Management', DisplayOrder: 1, Description: 'Access to voucher management section', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 4, ParentRightsId: 3, IsNavigationItem: true, Name: 'account_payable::voucher-management::voucher-entry::read', DisplayName: 'Voucher Entry', DisplayOrder: 1, Description: 'Create and manage voucher entries', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 5, ParentRightsId: 3, IsNavigationItem: true, Name: 'account_payable::voucher-management::purchase-journal::read', DisplayName: 'Purchase Journal', DisplayOrder: 2, Description: 'View and manage purchase journals', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 6, ParentRightsId: 3, IsNavigationItem: true, Name: 'account_payable::voucher-management::check-inquiry::read', DisplayName: 'Check Inquiry', DisplayOrder: 3, Description: 'Search and view check inquiries', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 7, ParentRightsId: 3, IsNavigationItem: true, Name: 'account_payable::voucher-management::voucher-maintenance::read', DisplayName: 'Voucher Maintenance', DisplayOrder: 4, Description: 'Maintain voucher information', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 8, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::open-payables::read', DisplayName: 'Open Payables', DisplayOrder: 2, Description: 'View all open payables', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 9, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::employee-expense-export::read', DisplayName: 'Employee Expense Export', DisplayOrder: 3, Description: 'Export employee expense data', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 10, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::payment-cycle::read', DisplayName: 'Payment Cycle', DisplayOrder: 4, Description: 'Manage and view payment cycles', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 11, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::clear-checks::read', DisplayName: 'Clear Checks', DisplayOrder: 5, Description: 'Clear and reconcile checks', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 12, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::vendor-management::read', DisplayName: 'Vendor Management', DisplayOrder: 6, Description: 'Manage vendors and related data', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 13, ParentRightsId: 12, IsNavigationItem: true, Name: 'account_payable::vendor-management::vendor-maintenance::read', DisplayName: 'Vendor Maintenance', DisplayOrder: 1, Description: 'Maintain vendor records', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 14, ParentRightsId: 12, IsNavigationItem: true, Name: 'account_payable::vendor-management::vendor-owner-mapping::read', DisplayName: 'Vendor Owner Mapping', DisplayOrder: 2, Description: 'Map vendors to owners', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 15, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::ap-period-end::read', DisplayName: 'A/P Period End', DisplayOrder: 7, Description: 'Close and manage AP periods', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 16, ParentRightsId: 15, IsNavigationItem: true, Name: 'account_payable::ap-period-end::vendor-month-year-end::read', DisplayName: 'Vendor Month/Year End', DisplayOrder: 1, Description: 'Close vendor month/year end processes', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 17, ParentRightsId: 15, IsNavigationItem: true, Name: 'account_payable::ap-period-end::vendor-file-maintenance::read', DisplayName: 'Vendor File Maintenance (1099)', DisplayOrder: 2, Description: 'Maintain vendor 1099 files', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 18, ParentRightsId: 15, IsNavigationItem: true, Name: 'account_payable::ap-period-end::year-end-1099-process-me::read', DisplayName: 'Year-End 1099 Process', DisplayOrder: 3, Description: 'Run year-end 1099 processes', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 19, ParentRightsId: 15, IsNavigationItem: true, Name: 'account_payable::ap-period-end::update-1099-file::read', DisplayName: 'Update 1099 File', DisplayOrder: 4, Description: 'Update 1099 vendor files', Url: '', IsVisible: false, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },

      { RightsId: 20, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::ap-report-menu::read', DisplayName: 'A/P Reports Menu', DisplayOrder: 8, Description: 'Access accounts payable reports', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 21, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::ap-maintenance::read', DisplayName: 'A/P Maintenance', DisplayOrder: 9, Description: 'Perform accounts payable maintenance', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now },
      { RightsId: 22, ParentRightsId: 2, IsNavigationItem: true, Name: 'account_payable::auth-generate::read', DisplayName: 'Auth Generate', DisplayOrder: 10, Description: 'Generate authorization records', Url: '', IsVisible: true, Status: 1, CreatedBy: 0, CreatedOn: now, UpdatedOn: now }
    ];

    await queryInterface.bulkInsert('Rights', rightsSeed);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'Rights',
      {
        RightsId: {
          [Op.between]: [1, 22]
        }
      },
      {}
    );
  }
};
