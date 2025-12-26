// import { useEffect } from 'react';
import { decryptData } from './cryptoUtils';

export interface NavigationItem {
  RightsId: string;
  ParentRightsId: string | null;
  DisplayName: string;
  Name: string;
  Url: string;
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  navigationData: NavigationItem[];
}

/**
 * rightsV2 entry type from ME API
 *
 * Example:
 * {
 *   "Ap::VNMT::VendorMaintenance::RW": {
 *     "path": "accounts-payable/vendor-management/vendor-maintenance/add-vendor"
 *   }
 * }
 */
export interface RightsV2Entry {
  path?: string;
  // Allow backend to add other helper fields without breaking FE
  [key: string]: unknown;
}

export type RightsV2Map = Record<string, RightsV2Entry>;

/**
 * Extract flat rights array from the auth/me API response.
 * This normalizes both encrypted and already-decrypted shapes.
 */
export function extractRights(authResponse: any): string[] {
  if (!authResponse) {
    return [];
  }

  // --- NEW: Prefer rightsv2 / rightsV2 when available (minimal change) ---
  try {
    // Try to read rightsV2 using the helper logic below without duplicating decryption code
    // (extractRightsV2 handles encrypted `items` shapes as well).
    // We call it here even though it's declared later in this file — function declarations are hoisted.
    // If rightsV2 map exists and has keys, return those keys as the flattened rights array.
    // This preserves ::R / ::RW suffixes which downstream code expects.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const rightsV2Map: RightsV2Map = extractRightsV2(authResponse);
    if (rightsV2Map && typeof rightsV2Map === 'object' && Object.keys(rightsV2Map).length > 0) {
      return Object.keys(rightsV2Map).map((k) => String(k).trim()).filter(Boolean);
    }
  } catch (err) {
    // non-fatal — fall back to legacy extraction below
    // eslint-disable-next-line no-console
    console.warn('extractRights: failed to read rightsV2, falling back to legacy rights array', err);
  }

  let processedResponse = authResponse;

  try {
    // Handle encrypted `items` shape (same as navigation)
    if (
      authResponse.items &&
      typeof authResponse.items === 'object' &&
      'iv' in authResponse.items &&
      'payload' in authResponse.items
    ) {
      try {
        processedResponse = decryptData(authResponse.items as any);
      } catch (error) {
        console.error('❌ Failed to decrypt rights data:', error);
        processedResponse = authResponse;
      }
    }

    // Common decrypted shapes:
    // 1) { rights: [...] }
    // 2) { items: { rights: [...] } }
    if (Array.isArray((processedResponse as any).rights)) {
      return (processedResponse as any).rights;
    }

    if (
      (processedResponse as any).items &&
      Array.isArray((processedResponse as any).items.rights)
    ) {
      return (processedResponse as any).items.rights;
    }
  } catch (error) {
    console.error('❌ Error extracting rights from auth response:', error);
  }

  return [];
}

/**
 * Extract rightsV2 object from the auth/me API response.
 *
 * Supports both encrypted `items` payload (same as navigation/rights)
 * and already-decrypted shapes.
 */
export function extractRightsV2(authResponse: any): RightsV2Map {
  if (!authResponse) {
    return {};
  }

  let processedResponse = authResponse as any;

  try {
    // Handle encrypted `items` shape (same as navigation)
    if (
      processedResponse.items &&
      typeof processedResponse.items === 'object' &&
      'iv' in processedResponse.items &&
      'payload' in processedResponse.items
    ) {
      try {
        processedResponse = decryptData(processedResponse.items as any);
      } catch (error) {
        console.error('❌ Failed to decrypt rightsV2 data:', error);
        // Fall back to original response – caller will simply see no rightsV2
        processedResponse = authResponse;
      }
    }

    // Common decrypted shapes (support both rightsV2 and rightsv2 casing):
    // 1) { rightsV2: { ... } } or { rightsv2: { ... } }
    // 2) { items: { rightsV2: { ... } } } or { items: { rightsv2: { ... } } }
    const topLevel =
      (processedResponse as any).rightsV2 ||
      (processedResponse as any).rightsv2;

    if (topLevel && typeof topLevel === 'object') {
      return topLevel as RightsV2Map;
    }

    const itemsLevel =
      (processedResponse as any).items &&
      (typeof (processedResponse as any).items === 'object'
        ? (processedResponse as any).items.rightsV2 ||
          (processedResponse as any).items.rightsv2
        : null);

    if (itemsLevel && typeof itemsLevel === 'object') {
      return itemsLevel as RightsV2Map;
    }
  } catch (error) {
    console.error('❌ Error extracting rightsV2 from auth response:', error);
  }

  return {};
}

const normalizePath = (path: string): string =>
  path.replace(/^\//, '').replace(/\/+$/, '');

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Check if a concrete pathname (e.g. "/accounts-payable/vendor-management/vendor-maintenance/add-vendor")
 * is allowed by the rightsV2 map from ME API.
 *
 * - Matches paths exactly (no implicit parent/child inheritance)
 * - Supports dynamic route segments defined with ":" in rightsV2 path
 *   e.g. "accounts-payable/.../edit-vendor/:vendorNo"
 */
export function hasPathAccessFromRightsV2(
  rightsV2: RightsV2Map | null | undefined,
  pathname: string,
): boolean {
  if (!rightsV2 || typeof rightsV2 !== 'object') {
    return false;
  }

  const currentPath = normalizePath(pathname);
  if (!currentPath) {
    return false;
  }

  const entries = Object.values(rightsV2) as RightsV2Entry[];
  if (!entries.length) {
    return false;
  }

  for (const entry of entries) {
    const rawPath = typeof entry?.path === 'string' ? entry.path.trim() : '';
    if (!rawPath) continue;

    const normalizedRightPath = normalizePath(rawPath);
    if (!normalizedRightPath) continue;

    // Convert ":" params to wildcard segments
    const pattern = normalizedRightPath
      .split('/')
      .map((segment) =>
        segment.startsWith(':') ? '[^/]+' : escapeRegExp(segment),
      )
      .join('/');

    const regex = new RegExp(`^${pattern}$`, 'i');

    if (regex.test(currentPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Extract navigation data from the auth response
 */
/**
 * Search for a node in the hierarchical navigation tree by DisplayName
 */
export function findNodeByDisplayName(nodes: any[], displayName: string): any | null {
  for (const node of nodes) {
    if (node.DisplayName === displayName) {
      return node;
    }
    
    // Search in children recursively
    if (node.children && Array.isArray(node.children)) {
      const found = findNodeByDisplayName(node.children, displayName);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Search for a node in the hierarchical navigation tree by RightsId
 */
/* function _findNodeByRightsId(nodes: any[], rightsId: string): any | null {
  for (const node of nodes) {
    if (node.RightsId === rightsId) {
      return node;
    }
    
    // Search in children recursively
    if (node.children && Array.isArray(node.children)) {
      const found = _findNodeByRightsId(node.children, rightsId);
      if (found) {
        return found;
      }
    }
  }
  return null;
} */

/**
 * Check if a specific DisplayName exists in the navigation tree
 */
function hasDisplayName(nodes: any[], displayName: string): boolean {
  return findNodeByDisplayName(nodes, displayName) !== null;
}

export function extractNavigationData(authResponse: any): any[] {
  if (!authResponse) {
    console.warn('⚠️ No auth response provided');
    return [];
  }

  try {
    let processedResponse = authResponse;

    // Check if response has encrypted items field
    if (authResponse.items && typeof authResponse.items === 'object' && 
        'iv' in authResponse.items && 'payload' in authResponse.items) {

      try {
        processedResponse = decryptData(authResponse.items as any);
      
      } catch (error) {
        console.error('❌ Failed to decrypt navigation data:', error);
        processedResponse = authResponse;
      }
    }

    // Return hierarchical navigation structure directly
    if (processedResponse.navigation && Array.isArray(processedResponse.navigation)) {
     
      return processedResponse.navigation;
    }

    // Fallback to old flat structure (convert to expected format)
    let navigationData: NavigationItem[] = [];

    if (processedResponse.items && Array.isArray(processedResponse.items)) {
      navigationData = processedResponse.items;
    } else if (processedResponse.items && processedResponse.items.navigation && Array.isArray(processedResponse.items.navigation)) {
      navigationData = processedResponse.items.navigation;
    }

   
    return navigationData;
  } catch (error) {
    console.error('❌ Error extracting navigation data:', error);
    return [];
  }
}

/**
 * Check if user has access to a specific module by DisplayName
 */
export function hasPermission(authResponse: any, displayName: string): PermissionCheckResult {
  const navigationData = extractNavigationData(authResponse);
  
  if (navigationData.length === 0) {
    console.warn(`🔒 No navigation data found - denying access to: ${displayName}`);
    return { hasPermission: false, navigationData };
  }

  const hasAccess = hasDisplayName(navigationData, displayName);
 
  return { hasPermission: hasAccess, navigationData };
}

/**
 * Check if user has any permission that starts with a prefix
 */
export function hasPermissionStartingWith(authResponse: any, permissionPrefix: string): PermissionCheckResult {
  const navigationData = extractNavigationData(authResponse);
  
  if (navigationData.length === 0) {
    console.warn(`🔒 No navigation data found - denying permission prefix: ${permissionPrefix}`);
    return { hasPermission: false, navigationData };
  }

  const hasAccess = navigationData.some(item => {
    return item.Name && item.Name.startsWith(permissionPrefix);
  });

  
  
  return { hasPermission: hasAccess, navigationData };
}

/**
 * Get all permissions for a specific module
 */
export function getModulePermissions(authResponse: any, modulePrefix: string): NavigationItem[] {
  const navigationData = extractNavigationData(authResponse);
  
  const modulePermissions = navigationData.filter(item => {
    return item.Name && item.Name.startsWith(modulePrefix);
  });

  
  
  return modulePermissions;
}

/**
 * Check if user has access to voucher entry functionality
 */
export function hasVoucherEntryAccess(authResponse: any): PermissionCheckResult {
  return hasPermission(authResponse, 'Voucher Entry');
}

/**
 * Check if user has access to purchase journal functionality
 */
export function hasPurchaseJournalAccess(authResponse: any): PermissionCheckResult {
  return hasPermission(authResponse, 'Purchase Journal');
}

/**
 * Check if user has access to check inquiry functionality
 */
export function hasCheckInquiryAccess(authResponse: any): PermissionCheckResult {
  return hasPermission(authResponse, 'Check Inquiry');
}

/**
 * Check if user has access to voucher maintenance functionality
 */
export function hasVoucherMaintenanceAccess(authResponse: any): PermissionCheckResult {
  return hasPermission(authResponse, 'Voucher Maintenance');
}

/**
 * Get all voucher management permissions
 */
export function getVoucherManagementPermissions(authResponse: any): any[] {
  const navigationData = extractNavigationData(authResponse);
  const voucherMgmtNode = findNodeByDisplayName(navigationData, 'Voucher Management');
  return voucherMgmtNode?.children || [];
}
