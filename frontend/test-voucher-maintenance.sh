#!/bin/bash

# Voucher Maintenance Test Runner Script
# This script provides easy commands to run voucher maintenance related tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test files
VOUCHER_TESTS=(
  "src/__tests__/components/modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance.test.tsx"
  "src/__tests__/components/widget-library/VoucherDiscountModifyModal.test.tsx"
  "src/__tests__/utils/dateFormatters.test.ts"
)

print_header() {
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}  Voucher Maintenance Tests${NC}"
  echo -e "${BLUE}================================${NC}"
  echo
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ️  $1${NC}"
}

run_component_tests() {
  print_info "Running VoucherMaintenance component tests..."
  npx vitest run "${VOUCHER_TESTS[0]}" --reporter=verbose
}

run_modal_tests() {
  print_info "Running VoucherDiscountModify modal tests..."
  npx vitest run "${VOUCHER_TESTS[1]}" --reporter=verbose
}

run_utility_tests() {
  print_info "Running date formatter utility tests..."
  npx vitest run "${VOUCHER_TESTS[2]}" --reporter=verbose
}

run_all_voucher_tests() {
  print_info "Running all voucher maintenance tests..."
  npx vitest run "${VOUCHER_TESTS[@]}" --reporter=verbose
}

run_with_coverage() {
  print_info "Running voucher maintenance tests with coverage..."
  npx vitest run "${VOUCHER_TESTS[@]}" --coverage --reporter=verbose
}

run_watch_mode() {
  print_info "Running voucher maintenance tests in watch mode..."
  npx vitest "${VOUCHER_TESTS[@]}" --reporter=verbose
}

run_ui_mode() {
  print_info "Opening Vitest UI for voucher maintenance tests..."
  npx vitest --ui "${VOUCHER_TESTS[@]}"
}

show_help() {
  print_header
  echo "Usage: $0 [command]"
  echo
  echo "Commands:"
  echo "  component    Run VoucherMaintenance component tests only"
  echo "  modal        Run VoucherDiscountModify modal tests only"
  echo "  utils        Run date formatter utility tests only"
  echo "  all          Run all voucher maintenance tests (default)"
  echo "  coverage     Run all tests with coverage report"
  echo "  watch        Run tests in watch mode"
  echo "  ui           Open Vitest UI"
  echo "  help         Show this help message"
  echo
  echo "Examples:"
  echo "  $0                    # Run all voucher maintenance tests"
  echo "  $0 component         # Run only component tests"
  echo "  $0 coverage          # Run with coverage"
  echo "  $0 watch             # Watch mode"
  echo
  echo "Test files:"
  for test_file in "${VOUCHER_TESTS[@]}"; do
    echo "  - $test_file"
  done
  echo
}

# Main script logic
case "${1:-all}" in
  "component")
    print_header
    run_component_tests
    print_success "Component tests completed!"
    ;;
  "modal")
    print_header
    run_modal_tests
    print_success "Modal tests completed!"
    ;;
  "utils")
    print_header
    run_utility_tests
    print_success "Utility tests completed!"
    ;;
  "all")
    print_header
    run_all_voucher_tests
    print_success "All voucher maintenance tests completed!"
    ;;
  "coverage")
    print_header
    run_with_coverage
    print_success "Tests with coverage completed!"
    ;;
  "watch")
    print_header
    run_watch_mode
    ;;
  "ui")
    print_header
    run_ui_mode
    ;;
  "help"|"-h"|"--help")
    show_help
    ;;
  *)
    print_error "Unknown command: $1"
    echo
    show_help
    exit 1
    ;;
esac