/**
 * Search for a node in the hierarchical navigation tree by DisplayName
 */
function findNodeByDisplayName(nodes: any[], displayName: string): any | null {
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

export interface NavigationItem {
  RightsId: string;
  ParentRightsId: string | null;
  DisplayName: string;
  Name: string;
  Url: string;
}

export interface GeneratedCard {
  title: string;
  desc: string;
  route: string;
  permission: string;
  rightsId: string;
  parentRightsId: string | null;
}

// Route mapping based on DisplayName from hierarchical navigation
// These are for the direct children of "Account Payables"
const DISPLAYNAME_TO_ROUTE_MAPPING: Record<string, string> = {
  // Parent modules (direct children of Account Payables)
  'Voucher Management': 'voucher-management/voucher-entry/normal', // Default to voucher entry
  'Open Payables': 'open-payables',
  'Employee Expense Export': 'employee-expenses-export',
  'Payment Cycle': 'payment-cycle',
  'Clear Checks': 'clear-checks',
  'Vendor Management': 'vendor-management/vendor-maintenance', // Default to vendor maintenance
  'A/P Period End': 'ap-period/vendor-month-year-end-process', // Default to first child
  'A/P Reports Menu': 'ap-reports',
  'A/P Maintenance': 'ap-maintenance',
  'Auth Generate': 'auth-generate',
};

// Default descriptions for different modules based on DisplayName
// These are for the direct children of "Account Payables"
const DISPLAYNAME_TO_DESCRIPTION_MAPPING: Record<string, string> = {
  'Voucher Management': 'Manage voucher entries, purchase journals, and check inquiries',
  'Open Payables': 'View and manage unpaid supplier invoices',
  'Employee Expense Export': 'Export employee expense data for processing',
  'Payment Cycle': 'Perform Payment Selection, Print Checks and Checks Register together',
  'Clear Checks': 'Upload, cancel and post checks',
  'Vendor Management': 'Look up vendor details, history, account and owner details',
  'A/P Period End': 'Period end processing for Accounts Payable',
  'A/P Reports Menu': 'Generate and view Accounts Payable reports',
  'A/P Maintenance': 'Central navigation for control file maintenance',
  'Auth Generate': 'Generate authorization codes and tokens',
};

/**
 * Generate cards from backend navigation data
 * Only creates cards for items that have routes (are actionable)
 */
/**
 * Recursively collect all leaf nodes (nodes with no children or empty children array)
 */
/* function _collectLeafNodes(nodes: any[]): any[] {
  const leafNodes: any[] = [];
  
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      // This is a leaf node
      leafNodes.push(node);
    } else {
      // This has children, recurse into them
      leafNodes.push(..._collectLeafNodes(node.children));
    }
  }
  
  return leafNodes;
} */

export const generateCardsFromBackendNavigation = (navigationData: any[]): GeneratedCard[] => {
  
  
  const generatedCards: GeneratedCard[] = [];
  
  // Find the "Account Payables" node and get its direct children only
  const accountPayablesNode = findNodeByDisplayName(navigationData, 'Account Payables');
  
  if (!accountPayablesNode || !accountPayablesNode.children) {
    console.warn('⚠️ Account Payables node not found or has no children');
    return [];
  }
  
  const directChildren = accountPayablesNode.children;
 
  
  // Filter direct children that should become cards (have routes)
  const cardableItems = directChildren.filter((item: any) => {
    const displayName = item.DisplayName;
    const hasRoute = DISPLAYNAME_TO_ROUTE_MAPPING[displayName];
    
   
    
    return displayName && hasRoute;
  });
  

  
  // Sort by RightsId to maintain backend order
  cardableItems.sort((a: any, b: any) => parseInt(a.RightsId) - parseInt(b.RightsId));
  
  cardableItems.forEach((navItem: any) => {
    const displayName = navItem.DisplayName;
    const route = DISPLAYNAME_TO_ROUTE_MAPPING[displayName];
    
    const card: GeneratedCard = {
      title: displayName,
      desc: DISPLAYNAME_TO_DESCRIPTION_MAPPING[displayName] || `Access ${displayName} functionality`,
      route: route,
      permission: displayName, // Use DisplayName as permission identifier
      rightsId: navItem.RightsId,
      parentRightsId: accountPayablesNode.RightsId // Set parent as Account Payables
    };
    
    generatedCards.push(card);

  });
  
  // Sort cards by RightsId to maintain backend order
  generatedCards.sort((a, b) => parseInt(a.rightsId) - parseInt(b.rightsId));
  
 
  return generatedCards;
};

/**
 * Get icon index for a card based on its permission
 * This maintains compatibility with the existing icon array
 */
export const getIconIndexForCard = (displayName: string): number => {
  const iconMapping: Record<string, number> = {
    // Direct children of Account Payables
    'Voucher Management': 0,        // FileTextOutlined
    'Open Payables': 3,             // IdcardOutlined  
    'Employee Expense Export': 5,   // SnippetsOutlined
    'Payment Cycle': 4,             // WalletOutlined
    'Clear Checks': 6,              // TeamOutlined
    'Vendor Management': 7,         // FileTextOutlined
    'A/P Period End': 9,            // FileSyncOutlined
    'A/P Reports Menu': 8,          // LineChartOutlined
    'A/P Maintenance': 10,          // SnippetsOutlined
    'Auth Generate': 13,            // IdcardOutlined
  };
  
  const iconIndex = iconMapping[displayName];
  if (iconIndex === undefined) {
    console.warn(`⚠️ No icon mapping found for DisplayName: ${displayName}, using default icon (0)`);
    return 0; // Default to first icon if not found
  }
  
  return iconIndex;
};

/**
 * Extract navigation data from auth response
 */
export const extractNavigationFromAuthResponse = (authResponse: any): NavigationItem[] => {
  if (!authResponse) {
    console.warn('⚠️ No auth response provided');
    return [];
  }

  

  try {
    // First, check if we need to decrypt the items field
    if (authResponse.items && typeof authResponse.items === 'object' && 
        'iv' in authResponse.items && 'payload' in authResponse.items) {
     
      // Import decryptData dynamically to avoid circular dependencies
      import('./cryptoUtils').then(({ decryptData }) => {
        try {
          const decryptedData = decryptData(authResponse.items);
      
          if (decryptedData.navigation && Array.isArray(decryptedData.navigation)) {
     
            return decryptedData.navigation;
          }
        } catch (error) {
          console.error('❌ Failed to decrypt auth response:', error);
        }
      });
      return []; // Return empty for now, this is async
    }
    
    // Check if navigation is directly available (already decrypted)
    if (authResponse.navigation && Array.isArray(authResponse.navigation)) {
    
      return authResponse.navigation;
    }
    
    // Check if it's nested in items (already decrypted)
    if (authResponse.items && authResponse.items.navigation && Array.isArray(authResponse.items.navigation)) {
     
      return authResponse.items.navigation;
    }
    
    // Check if the entire items object is the decrypted data
    if (authResponse.items && Array.isArray(authResponse.items)) {

      return authResponse.items;
    }
    
    console.warn('⚠️ No navigation array found in auth response');
 
    return [];
  } catch (error) {
    console.error('❌ Error extracting navigation data:', error);
    return [];
  }
};
