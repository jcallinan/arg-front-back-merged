# Voucher Maintenance Test Runner Script (PowerShell)
# This script provides easy commands to run voucher maintenance related tests

param(
    [string]$Command = "all"
)

# Test files
$VoucherTests = @(
    "src/__tests__/components/modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance.test.tsx",
    "src/__tests__/components/widget-library/VoucherDiscountModifyModal.test.tsx",
    "src/__tests__/utils/dateFormatters.test.ts"
)

function Print-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "  Voucher Maintenance Tests" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

function Run-ComponentTests {
    Print-Info "Running VoucherMaintenance component tests..."
    npx vitest run $VoucherTests[0] --reporter=verbose
}

function Run-ModalTests {
    Print-Info "Running VoucherDiscountModify modal tests..."
    npx vitest run $VoucherTests[1] --reporter=verbose
}

function Run-UtilityTests {
    Print-Info "Running date formatter utility tests..."
    npx vitest run $VoucherTests[2] --reporter=verbose
}

function Run-AllVoucherTests {
    Print-Info "Running all voucher maintenance tests..."
    npx vitest run @VoucherTests --reporter=verbose
}

function Run-WithCoverage {
    Print-Info "Running voucher maintenance tests with coverage..."
    npx vitest run @VoucherTests --coverage --reporter=verbose
}

function Run-WatchMode {
    Print-Info "Running voucher maintenance tests in watch mode..."
    npx vitest @VoucherTests --reporter=verbose
}

function Run-UIMode {
    Print-Info "Opening Vitest UI for voucher maintenance tests..."
    npx vitest --ui @VoucherTests
}

function Show-Help {
    Print-Header
    Write-Host "Usage: .\test-voucher-maintenance.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  component    Run VoucherMaintenance component tests only"
    Write-Host "  modal        Run VoucherDiscountModify modal tests only"
    Write-Host "  utils        Run date formatter utility tests only"
    Write-Host "  all          Run all voucher maintenance tests (default)"
    Write-Host "  coverage     Run all tests with coverage report"
    Write-Host "  watch        Run tests in watch mode"
    Write-Host "  ui           Open Vitest UI"
    Write-Host "  help         Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\test-voucher-maintenance.ps1                    # Run all voucher maintenance tests"
    Write-Host "  .\test-voucher-maintenance.ps1 component         # Run only component tests"
    Write-Host "  .\test-voucher-maintenance.ps1 coverage          # Run with coverage"
    Write-Host "  .\test-voucher-maintenance.ps1 watch             # Watch mode"
    Write-Host ""
    Write-Host "Test files:"
    foreach ($testFile in $VoucherTests) {
        Write-Host "  - $testFile"
    }
    Write-Host ""
}

# Main script logic
switch ($Command) {
    "component" {
        Print-Header
        Run-ComponentTests
        Print-Success "Component tests completed!"
    }
    "modal" {
        Print-Header
        Run-ModalTests
        Print-Success "Modal tests completed!"
    }
    "utils" {
        Print-Header
        Run-UtilityTests
        Print-Success "Utility tests completed!"
    }
    "all" {
        Print-Header
        Run-AllVoucherTests
        Print-Success "All voucher maintenance tests completed!"
    }
    "coverage" {
        Print-Header
        Run-WithCoverage
        Print-Success "Tests with coverage completed!"
    }
    "watch" {
        Print-Header
        Run-WatchMode
    }
    "ui" {
        Print-Header
        Run-UIMode
    }
    "help" {
        Show-Help
    }
    default {
        Print-Error "Unknown command: $Command"
        Write-Host ""
        Show-Help
        exit 1
    }
}