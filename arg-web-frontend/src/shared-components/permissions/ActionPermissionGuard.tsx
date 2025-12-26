import type { ReactNode } from "react";
import PermissionGuard from "./PermissionGuard";
import { getRightKeyForAction } from "@/config/accessControl";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import { extractRights } from "@/utils/permissionUtils";

export interface ActionPermissionGuardProps {
  /**
   * Semantic action identifier, e.g. "open-payables.generate-report".
   * The actual backend right key is looked up centrally, not hardcoded
   * in the component using this wrapper.
   */
  actionId: string;
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * Controls whether RW is required to keep the wrapped control enabled.
   * - true (default): read-only users see the control disabled
   * - false: read-only users see the control enabled (for non-CRUD actions)
   */
  requireManage?: boolean;
}

/**
 * ActionPermissionGuard
 *
 * Thin wrapper over PermissionGuard that resolves a semantic actionId
 * to a backend right key via config, so UI code never hardcodes
 * permission strings.
 */
const ActionPermissionGuard: React.FC<ActionPermissionGuardProps> = ({
  actionId,
  children,
  fallback = null,
  requireManage = true,
}) => {
  const { lastLoginResponse } = useAuth();
  const rights = extractRights(lastLoginResponse);
  const rightKey = getRightKeyForAction(actionId, rights);

  if (!rightKey) {
    return <>{fallback}</>;
  }

  return (
    <PermissionGuard rightKey={rightKey} requireManage={requireManage}>
      {children}
    </PermissionGuard>
  );
};

export default ActionPermissionGuard;


