#!/usr/bin/env node

/**
 * Test Runner Script for Voucher Maintenance Module
 * 
 * This script provides utilities to run specific test suites
 * and generate coverage reports for the voucher maintenance functionality.
 */

import { execSync } from 'child_process';

const VOUCHER_MAINTENANCE_TESTS = [
  'src/__tests__/components/modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance.test.tsx',
  'src/__tests__/components/widget-library/VoucherDiscountModifyModal.test.tsx',
  'src/__tests__/utils/dateFormatters.test.ts',
];

const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
};

const runVoucherMaintenanceTests = () => {
  const testFiles = VOUCHER_MAINTENANCE_TESTS.join(' ');
  runCommand(`npx vitest run ${testFiles}`);
};

const runVoucherMaintenanceTestsWithCoverage = () => {
  const testFiles = VOUCHER_MAINTENANCE_TESTS.join(' ');
  runCommand(`npx vitest run --coverage ${testFiles}`);
};

const runVoucherMaintenanceTestsWatch = () => {
  const testFiles = VOUCHER_MAINTENANCE_TESTS.join(' ');
  runCommand(`npx vitest watch ${testFiles}`);
};

const runAllTests = () => {
  runCommand('npm run test:run');
};

const runAllTestsWithCoverage = () => {
  runCommand('npm run test:coverage');
};

const showHelp = () => {
  console.log(`
Voucher Maintenance Test Runner

Usage:
  npm run test:voucher           - Run voucher maintenance tests
  npm run test:voucher:coverage  - Run voucher maintenance tests with coverage
  npm run test:voucher:watch     - Run voucher maintenance tests in watch mode
  npm run test:all               - Run all tests
  npm run test:all:coverage      - Run all tests with coverage

Available test suites:
  - VoucherMaintenance component tests
  - VoucherDiscountModify modal tests  
  - Date formatting utility tests

Test files:
${VOUCHER_MAINTENANCE_TESTS.map(file => `  - ${file}`).join('\n')}
  `);
};

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'voucher':
    runVoucherMaintenanceTests();
    break;
  case 'voucher:coverage':
    runVoucherMaintenanceTestsWithCoverage();
    break;
  case 'voucher:watch':
    runVoucherMaintenanceTestsWatch();
    break;
  case 'all':
    runAllTests();
    break;
  case 'all:coverage':
    runAllTestsWithCoverage();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}