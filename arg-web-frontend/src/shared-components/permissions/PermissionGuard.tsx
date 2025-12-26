import React, { cloneElement, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";
import { useAbility } from "@context/AbilityContext";

export interface PermissionGuardProps {
  /**
   * Backend right key that controls this element.
   * Can be either the base subject (e.g. "account-payable::voucher::flexi::upload")
   * or the full right with suffix (e.g. "account-payable::voucher::flexi::upload::rw").
   */
  rightKey: string;
  children: ReactNode;
  /**
   * Optional fallback to render when permission is missing.
   * Defaults to rendering nothing (hiding the control).
   */
  fallback?: ReactNode;
  /**
   * When true (default), users who have **read-only** permission will see
   * the wrapped control in a **disabled** state instead of the fallback.
   *
   * When false, read-only behaves the same as "no permission" and renders
   * the fallback.
   */
  showDisabledOnReadOnly?: boolean;
  /**
   * When true (default), the user must have **manage (RW)** permission
   * to see the control enabled. When false, **read (R)** permission is
   * enough to render the control in an enabled state.
   */
  requireManage?: boolean;
}

const normalizeRightKey = (rightKey: string): string => {
  if (!rightKey) return "";
  // Strip a trailing ::r / ::rw or :r / :rw if present so we always check by subject
  return rightKey.replace(/(?:::|:)(r|rw)$/i, "");
};

/**
 * PermissionGuard
 *
 * Reusable wrapper for controls (e.g. buttons) that should only be visible
 * when the user has **manage (RW)** permission for a given backend right key.
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  rightKey,
  children,
  fallback = null,
  showDisabledOnReadOnly = true,
  requireManage = true,
}) => {
  const ability = useAbility();
  const subject = normalizeRightKey(rightKey);

  if (!subject) {
    return <>{fallback}</>;
  }

  const canRead = ability.can("read", subject);
  const canManage = ability.can("manage", subject);

  // 1) No permission at all → render fallback (usually hides control)
  if (!canRead) {
    return <>{fallback}</>;
  }

  // If we don't require manage permission, read is enough to fully enable
  // the control. As long as the user can read, render children as-is.
  if (!requireManage) {
    return <>{children}</>;
  }

  // 2) Read-only (R but not RW) → show disabled control when requested
  if (!canManage) {
    if (!showDisabledOnReadOnly) {
      return <>{fallback}</>;
    }

    const disableElement = (node: ReactNode, index?: number): ReactNode => {
      if (!isValidElement(node)) {
        return node;
      }

      const element = node as ReactElement<any>;

      return cloneElement(element, {
        ...element.props,
        disabled: true,
        key: element.key ?? index,
      });
    };

    if (Array.isArray(children)) {
      return <>{children.map((child, idx) => disableElement(child, idx))}</>;
    }

    return <>{disableElement(children)}</>;
  }

  // 3) Manage (RW) → render children as-is; component props control disabled state
  return <>{children}</>;
};

export default PermissionGuard;

