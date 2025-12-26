import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ActionPermissionGuard from "@/shared-components/permissions/ActionPermissionGuard";
import { AbilityProvider } from "@/context/AbilityContext";

// Mock useAuth to control rights passed into both AbilityProvider and ActionPermissionGuard
vi.mock("@/modules/auth/customhooks/useAuth", () => {
  return {
    useAuth: () => mockAuthState,
  };
});

// Simple passthrough component so we always render the same button under the guard
const GuardedButton = ({ actionId }: { actionId: string }) => (
  <AbilityProvider>
    <ActionPermissionGuard actionId={actionId}>
      <button data-testid="guarded-button">Guarded</button>
    </ActionPermissionGuard>
  </AbilityProvider>
);

let mockAuthState: { lastLoginResponse: any };

describe("ActionPermissionGuard + Permission system (integration)", () => {
  beforeEach(() => {
    mockAuthState = { lastLoginResponse: { rights: [] } };
  });

  it("enables LMS Create Batch when user has both R and RW rights (colon suffix variant)", () => {
    mockAuthState.lastLoginResponse.rights = [
      // R only would normally grant read
      "Ap::VM::Voucher-Entry::LMS::FreightInvoice::CreateBatch:R",
      // RW should be preferred and grant manage
      "Ap::VM::Voucher-Entry::LMS::FreightInvoice::CreateBatch:RW",
    ];

    render(<GuardedButton actionId="voucher-entry.lms.create-batch" />);

    const btn = screen.getByTestId("guarded-button");
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("disables LMS Create Batch when user only has R for the subject", () => {
    mockAuthState.lastLoginResponse.rights = [
      "Ap::VM::Voucher-Entry::LMS::FreightInvoice::CreateBatch:R",
    ];

    render(<GuardedButton actionId="voucher-entry.lms.create-batch" />);

    // For actions that require RW, R-only should behave as no permission (button hidden)
    expect(screen.queryByTestId("guarded-button")).toBeNull();
  });

  it("does not render the button when the user has no matching rights", () => {
    mockAuthState.lastLoginResponse.rights = [
      // Some unrelated rights – should not match LMS Create Batch
      "Ap::VM::Voucher-Entry::Normal::R",
      "Ap::VM::Voucher-Entry::Normal::PostPurchaseJournal:RW",
    ];

    render(<GuardedButton actionId="voucher-entry.lms.create-batch" />);

    expect(screen.queryByTestId("guarded-button")).toBeNull();
  });
});


