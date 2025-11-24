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


