import type { FC, JSX } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { MenuUnfoldOutlined, MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Breadcrumbs from "@shared-components/breadcrumbs/BreadCrumbs";
import "./voucher-management/voucher-management.scss";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { BreadcrumbItem } from "@type-definitions/accounts-payable.types";
import {
   MENU_KEYS,
   MENU_LABELS,
   ROUTES,
} from "@constants/commonConstants";
import { useRoutePreloading } from "@hooks/useRoutePreloading";
import { useAuth } from "@modules/auth/customhooks/useAuth";
import { extractNavigationData, findNodeByDisplayName } from "@utils/permissionUtils";

const AccountsPayableLayout: FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [collapsed, setCollapsed] = useState<boolean>(false);
   const [openKeys, setOpenKeys] = useState<string[]>([]);
   const { getPreloadProps } = useRoutePreloading();
   const { lastLoginResponse, isLoading } = useAuth();


   // Helper function to check if user has permission for a menu item
   const hasPermission = useCallback((menuKey: string): boolean => {
      // If still loading, show all items (will be filtered once loaded)
      if (isLoading) return true;
      
      // Map menu keys to required DisplayNames from hierarchical navigation
      const displayNameMap: Record<string, string> = {
         [MENU_KEYS.VOUCHER_MANAGEMENT]: 'Voucher Management',
         [MENU_KEYS.VOUCHER_ENTRY]: 'Voucher Entry',
         [MENU_KEYS.PURCHASE_JOURNAL]: 'Purchase Journal',
         [MENU_KEYS.CHECK_INQUIRY]: 'Check Inquiry',
         [MENU_KEYS.VOUCHER_MAINTENANCE]: 'Voucher Maintenance',
         [MENU_KEYS.OPEN_PAYABLES]: 'Open Payables',
         [MENU_KEYS.EMPLOYEE_EXPENSES_EXPORT]: 'Employee Expense Export',
         [MENU_KEYS.PAYMENT_CYCLE]: 'Payment Cycle',
         [MENU_KEYS.CLEAR_CHECK]: 'Clear Checks',
         [MENU_KEYS.VENDOR_MANAGEMENT]: 'Vendor Management',
         [MENU_KEYS.VENDOR_MASTER_INQUIRY]: 'Vendor Maintenance',
         [MENU_KEYS.VENDOR_OWNER_MAPPING]: 'Vendor Owner Mapping',
         [MENU_KEYS.AP_PERIOD_END]: 'A/P Period End',
         [MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS]: 'Vendor Month/Year End',
         [MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099]: 'Vendor File Maintenance (1099)',
         [MENU_KEYS.YEAR_END_1099_PROCESS_MENU]: 'Year-End 1099 Process',
         [MENU_KEYS.UPDATE_1099_FILE]: 'Update 1099 File',
         [MENU_KEYS.AP_REPORTS]: 'A/P Reports Menu',
         [MENU_KEYS.AP_MAINTENANCE]: 'A/P Maintenance',
         [MENU_KEYS.AUTH_GENERATE]: 'Auth Generate',
      };

      const requiredDisplayName = displayNameMap[menuKey];
      if (!requiredDisplayName) {
         console.warn(`⚠️ No DisplayName mapping found for menu key: ${menuKey}`);
         return false; // Deny access if no mapping found
      }

      // Check if the DisplayName exists in the hierarchical navigation tree
      const hasAccess = hasDisplayNameInTree(lastLoginResponse, requiredDisplayName);
     
      return hasAccess;
   }, [lastLoginResponse, isLoading]);

   // Helper function to check if a DisplayName exists in the navigation tree
   const hasDisplayNameInTree = useCallback((authResponse: any, displayName: string): boolean => {
      if (!authResponse) return false;
      
      const navigationData = extractNavigationData(authResponse);
      return findNodeByDisplayName(navigationData, displayName) !== null;
   }, []);

   const selected = useMemo(() => {
      const parts = location.pathname.split("/").filter(Boolean); // Remove empty strings
      const fallback = MENU_KEYS.VOUCHER_ENTRY;

      if (parts.length <= 1 || parts[parts.length - 1] === "accounts-payable") {
         return fallback;
      }

      // Handle voucher-management routes
      if (location.pathname.includes("voucher-management")) {
         if (location.pathname.includes("check-inquiry")) {
            return MENU_KEYS.CHECK_INQUIRY;
         }

         const voucherParts = location.pathname
            .split("voucher-management/")[1]
            ?.split("/");
         if (voucherParts && voucherParts[0]) {
            const lastPart = voucherParts[voucherParts.length - 1];
            const secondLastPart = voucherParts[voucherParts.length - 2];

            // Handle create-new-entry routes
            if (lastPart === "create-new-entry") {
               return MENU_KEYS.VOUCHER_ENTRY; // Keep voucher-entry selected for create-new-entry
            }

            // Handle voucher-entry with process type ID
            if (
               voucherParts[0] === "voucher-entry" &&
               voucherParts.length >= 2
            ) {
               // If it's voucher-entry/[processType] or voucher-entry/[processType]/something
               return MENU_KEYS.VOUCHER_ENTRY;
            }

            if (
               secondLastPart &&
               (/^\d+$/.test(lastPart) ||
                  /^[a-f0-9-]{8,}$/i.test(lastPart) ||
                  lastPart === "detail")
            ) {
               return secondLastPart;
            }
            return voucherParts[0];
         }
         return MENU_KEYS.VOUCHER_ENTRY;
      }

      // Handle direct accounts-payable routes
      if (location.pathname.includes("check-inquiry")) {
         return MENU_KEYS.CHECK_INQUIRY;
      }

      const lastPart = parts[parts.length - 1];
      const secondLastPart = parts[parts.length - 2];

      if (
         secondLastPart &&
         (/^\d+$/.test(lastPart) ||
            /^[a-f0-9-]{8,}$/i.test(lastPart) ||
            lastPart === "detail")
      ) {
         return secondLastPart;
      }

      return lastPart;
   }, [location.pathname]);

   // Initialize with no sections open by default
   useEffect(() => {
      // Set initial state once when component mounts
      setOpenKeys([]);
   }, []); // Empty dependency array - only run on mount

   const breadcrumbKey = useMemo(() => {
      const parts = location.pathname.split("/").filter(Boolean);

      if (
         location.pathname.includes("check-inquiry") &&
         (location.pathname.includes("/detail") || parts.length > 4)
      ) {
         return MENU_KEYS.CHECK_INQUIRY_DETAIL;
      }

      // Check if we're on create-new-entry page in edit mode
      if (location.pathname.includes("create-new-entry")) {
         const { mode } = location.state || {};
         if (mode === "edit") {
            return MENU_KEYS.UPDATE_ENTRY;
         }
         return MENU_KEYS.CREATE_NEW_ENTRY;
      }

      // Check if we're on vendor add page
      if (location.pathname.includes("vendor-maintenance/add-vendor")) {
         return "ADD_VENDOR";
      }

      // Check if we're on vendor edit page
      if (location.pathname.includes("vendor-maintenance/edit-vendor")) {
         return "EDIT_VENDOR";
      }

      return selected;
   }, [location.pathname, location.state, selected]);

   const formatLabel = (text: string): string =>
      text
         .split("-")
         .map((s) =>
            s.toLowerCase() === "ap"
               ? "A/P"
               : s.charAt(0).toUpperCase() + s.slice(1)
         )
         .join(" ");

   // Map menu keys to preload keys
   const getPreloadKey = (menuKey: string) => {
      const keyMap: Record<string, string> = {
         [MENU_KEYS.VOUCHER_ENTRY]: "voucher-entry",
         [MENU_KEYS.PURCHASE_JOURNAL]: "purchase-journal",
         [MENU_KEYS.CHECK_INQUIRY]: "check-inquiry",
         [MENU_KEYS.VOUCHER_MAINTENANCE]: "voucher-maintenance",
         [MENU_KEYS.OPEN_PAYABLES]: "open-payables",
         [MENU_KEYS.PAYMENT_CYCLE]: "payment-cycle",
         [MENU_KEYS.VENDOR_MASTER_INQUIRY]: "vendor-maintenance",
         [MENU_KEYS.VENDOR_OWNER_MAPPING]: "vendor-owner-mapping",
         [MENU_KEYS.AP_PERIOD_END]: "ap-period",
         [MENU_KEYS.AP_REPORTS]: "ap-reports",
         [MENU_KEYS.AP_MAINTENANCE]: "ap-maintenance",
         [MENU_KEYS.EMPLOYEE_EXPENSES_EXPORT]: "employee-expenses-export",
         [MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS]: "vendor-month-year-end",
         [MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099]:
            "vendor-file-maintenance-1099",
         [MENU_KEYS.YEAR_END_1099_PROCESS_MENU]: "year-end-1099-process-menu",
         [MENU_KEYS.UPDATE_1099_FILE]: "update-1099-file",
         [MENU_KEYS.CLEAR_CHECK]: "clear-checks",
         [MENU_KEYS.AUTH_GENERATE]: "auth-generate",
      };
      return keyMap[menuKey] || null;
   };

   const getLabel = useCallback(
      (key: string): JSX.Element => {
         const isSelected = selected === key;
         const preloadKey = getPreloadKey(key);
         const preloadProps = preloadKey
            ? getPreloadProps(
                 preloadKey as Parameters<typeof getPreloadProps>[0]
              )
            : {};

         // Only apply selected styling when actually selected, not on hover
         const className = isSelected ? "sub-title selected-ap-menu p-l" : "";

         // Use predefined labels for specific menu items, otherwise use formatLabel
         const getLabelText = (menuKey: string) => {
            switch (menuKey) {
               case MENU_KEYS.AP_REPORTS:
                  return MENU_LABELS.AP_REPORTS;
               case MENU_KEYS.AP_PERIOD_END:
                  return MENU_LABELS.AP_PERIOD_END;
               case MENU_KEYS.AP_MAINTENANCE:
                  return MENU_LABELS.AP_MAINTENANCE;
               default:
                  return formatLabel(menuKey);
            }
         };

         return (
            <div className={className} {...preloadProps}>
               {getLabelText(key)}
            </div>
         );
      },
      [selected, getPreloadProps]
   );

   const menuItems: MenuProps["items"] = useMemo(() => {
      // Helper function to filter menu items based on permissions
      const filterMenuItem = (item: any): any | null => {
         if (!hasPermission(item.key)) {
            return null; // Filter out unauthorized items
         }

         // If item has children, filter them too
         if (item.children) {
            const authorizedChildren = item.children
               .map(filterMenuItem)
               .filter(Boolean); // Remove null items
            
            // If no children are authorized, don't show the parent either
            if (authorizedChildren.length === 0) {
               return null;
            }
            
            return { ...item, children: authorizedChildren };
         }

         return item;
      };

      // Define all menu items (same structure as before)
      const allMenuItems = [
         {
            key: MENU_KEYS.VOUCHER_MANAGEMENT,
            label: getLabel(MENU_KEYS.VOUCHER_MANAGEMENT),
            children: [
               {
                  key: MENU_KEYS.VOUCHER_ENTRY,
                  label: getLabel(MENU_KEYS.VOUCHER_ENTRY),
               },
               {
                  key: MENU_KEYS.PURCHASE_JOURNAL,
                  label: getLabel(MENU_KEYS.PURCHASE_JOURNAL),
               },
               {
                  key: MENU_KEYS.CHECK_INQUIRY,
                  label: getLabel(MENU_KEYS.CHECK_INQUIRY),
               },
               {
                  key: MENU_KEYS.VOUCHER_MAINTENANCE,
                  label: getLabel(MENU_KEYS.VOUCHER_MAINTENANCE),
               },
            ],
         },
         {
            key: MENU_KEYS.OPEN_PAYABLES,
            label: getLabel(MENU_KEYS.OPEN_PAYABLES),
         },
         {
            key: MENU_KEYS.EMPLOYEE_EXPENSES_EXPORT,
            label: getLabel(MENU_KEYS.EMPLOYEE_EXPENSES_EXPORT),
         },
         {
            key: MENU_KEYS.PAYMENT_CYCLE,
            label: getLabel(MENU_KEYS.PAYMENT_CYCLE),
         },
         {
            key: MENU_KEYS.CLEAR_CHECK,
            label: getLabel(MENU_KEYS.CLEAR_CHECK),
         },
         {
            key: MENU_KEYS.VENDOR_MANAGEMENT,
            label: getLabel(MENU_KEYS.VENDOR_MANAGEMENT),
            children: [
               {
                  key: MENU_KEYS.VENDOR_MASTER_INQUIRY,
                  label: getLabel(MENU_KEYS.VENDOR_MASTER_INQUIRY),
               },
               {
                  key: MENU_KEYS.VENDOR_OWNER_MAPPING,
                  label: getLabel(MENU_KEYS.VENDOR_OWNER_MAPPING),
               },
            ],
         },
         {
            key: MENU_KEYS.AP_PERIOD_END,
            label: getLabel(MENU_KEYS.AP_PERIOD_END),
            children: [
               {
                  key: MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS,
                  label: getLabel(MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS),
               },
               {
                  key: MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099,
                  label: getLabel(MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099),
               },
               {
                  key: MENU_KEYS.YEAR_END_1099_PROCESS_MENU,
                  label: getLabel(MENU_KEYS.YEAR_END_1099_PROCESS_MENU),
               },
               {
                  key: MENU_KEYS.UPDATE_1099_FILE,
                  label: getLabel(MENU_KEYS.UPDATE_1099_FILE),
               },
            ],
         },
         { key: MENU_KEYS.AP_REPORTS, label: getLabel(MENU_KEYS.AP_REPORTS) },
         {
            key: MENU_KEYS.AP_MAINTENANCE,
            label: getLabel(MENU_KEYS.AP_MAINTENANCE),
         },
         {
            key: MENU_KEYS.AUTH_GENERATE,
            label: getLabel(MENU_KEYS.AUTH_GENERATE),
         },
      ];

      // Filter menu items based on permissions
      const authorizedMenuItems = allMenuItems
         .map(filterMenuItem)
         .filter(Boolean); // Remove null items

      
      return authorizedMenuItems;
   }, [getLabel, hasPermission]);

   const handleSelect: MenuProps["onSelect"] = ({ key }) => {
      // Handle navigation based on the new route structure
      switch (key) {
         case MENU_KEYS.VOUCHER_MANAGEMENT:
            // Navigate to first child (voucher-entry)
            navigate(
               `/accounts-payable/voucher-management/voucher-entry/normal`
            );
            break;
         case MENU_KEYS.VOUCHER_ENTRY:
            navigate(
               `/accounts-payable/voucher-management/voucher-entry/normal`
            );
            break;
         case MENU_KEYS.PURCHASE_JOURNAL:
            navigate(`/accounts-payable/voucher-management/purchase-journal`);
            break;
         case MENU_KEYS.CHECK_INQUIRY:
            navigate(`/accounts-payable/voucher-management/check-inquiry`);
            break;
         case MENU_KEYS.VOUCHER_MAINTENANCE:
            navigate(
               `/accounts-payable/voucher-management/voucher-maintenance`
            );
            break;
         case MENU_KEYS.VENDOR_MANAGEMENT:
            // Navigate to first child (vendor-master-inquiry)
            navigate(`/accounts-payable/vendor-management/vendor-maintenance`);
            break;
         case MENU_KEYS.VENDOR_MASTER_INQUIRY:
            navigate(`/accounts-payable/vendor-management/vendor-maintenance`);
            break;
         case MENU_KEYS.VENDOR_OWNER_MAPPING:
            navigate(
               `/accounts-payable/vendor-management/vendor-owner-mapping`
            );
            break;
         case MENU_KEYS.AP_PERIOD_END:
            // Navigate to parent route, which will redirect to default child
            navigate(`/accounts-payable/ap-period`);
            break;
         case MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS:
            navigate(
               `/accounts-payable/ap-period/vendor-month-year-end-process`
            );
            break;
         case MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099:
            navigate(
               `/accounts-payable/ap-period/vendor-file-maintenance-1099`
            );
            break;
         case MENU_KEYS.YEAR_END_1099_PROCESS_MENU:
            navigate(`/accounts-payable/ap-period/year-end-1099-process-menu`);
            break;
         case MENU_KEYS.UPDATE_1099_FILE:
            navigate(`/accounts-payable/ap-period/update-1099-file`);
            break;
         case MENU_KEYS.AUTH_GENERATE:
            navigate(`/accounts-payable/auth-generate`);
            break;
         default:
            navigate(`/accounts-payable/${key}`);
      }
   };

   const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
      // Ensure only one section can be open at a time
      // If a new section is being opened, close all others
      if (keys.length > 1) {
         // Keep only the most recently opened section
         const newKey = keys.find((key) => !openKeys.includes(key));
         setOpenKeys(newKey ? [newKey] : []);
      } else {
         // Normal open/close behavior when only one section
         setOpenKeys(keys);
      }
   };

   const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
      const base: BreadcrumbItem[] = [
         { label: MENU_LABELS.ACCOUNTS_PAYABLE, path: ROUTES.ACCOUNTS_PAYABLE },
      ];

      const extractProcessType = () => {
         const pathParts = location.pathname.split("/");
         const voucherEntryIndex = pathParts.indexOf("voucher-entry");
         if (
            voucherEntryIndex !== -1 &&
            voucherEntryIndex + 1 < pathParts.length
         ) {
            return pathParts[voucherEntryIndex + 1];
         }
         return "normal"; // fallback to normal
      };

      const currentProcessType = extractProcessType();
      const voucherEntryPath = `/accounts-payable/voucher-management/voucher-entry/${currentProcessType}`;

      const mapping: Record<string, BreadcrumbItem[]> = {
         [MENU_KEYS.VOUCHER_ENTRY]: [
            {
               label: MENU_LABELS.VOUCHER_ENTRY,
               path: voucherEntryPath,
            },
         ],
         [MENU_KEYS.VOUCHER_MAINTENANCE]: [
            {
               label: MENU_LABELS.VOUCHER_MAINTENANCE,
               path: "/accounts-payable/voucher-management/voucher-maintenance",
            },
         ],
         [MENU_KEYS.CREATE_NEW_ENTRY]: [
            {
               label: MENU_LABELS.VOUCHER_ENTRY,
               path: voucherEntryPath,
            },
            {
               label: MENU_LABELS.CREATE_NEW_ENTRY,
               path: location.pathname.includes("/voucher-entry/")
                  ? location.pathname
                  : `${voucherEntryPath}/create-new-entry`,
            },
         ],
         [MENU_KEYS.UPDATE_ENTRY]: [
            {
               label: MENU_LABELS.VOUCHER_ENTRY,
               path: voucherEntryPath,
            },
            {
               label: MENU_LABELS.UPDATE_ENTRY,
               path: location.pathname.includes("/voucher-entry/")
                  ? location.pathname
                  : `${voucherEntryPath}/create-new-entry`,
            },
         ],
         [MENU_KEYS.PURCHASE_JOURNAL]: [
            {
               label: MENU_LABELS.PURCHASE_JOURNAL,
               path: "/accounts-payable/voucher-management/purchase-journal",
            },
         ],
         [MENU_KEYS.AP_REPORTS]: [
            {
               label: MENU_LABELS.AP_REPORTS,
               path: "/accounts-payable/ap-reports",
            },
         ],
         [MENU_KEYS.AP_PERIOD_END]: [
            {
               label: MENU_LABELS.AP_PERIOD_END,
               path: "/accounts-payable/ap-period",
            },
         ],
         [MENU_KEYS.VENDOR_MONTH_YEAR_END_PROCESS]: [
            {
               label: MENU_LABELS.VENDOR_MONTH_YEAR_END_PROCESS,
               path: "/accounts-payable/ap-period/vendor-month-year-end-process",
            },
         ],
         [MENU_KEYS.VENDOR_FILE_MAINTENANCE_1099]: [
            {
               label: MENU_LABELS.VENDOR_FILE_MAINTENANCE_1099,
               path: "/accounts-payable/ap-period/vendor-file-maintenance-1099",
            },
         ],
         [MENU_KEYS.YEAR_END_1099_PROCESS_MENU]: [
            {
               label: MENU_LABELS.YEAR_END_1099_PROCESS_MENU,
               path: "/accounts-payable/ap-period/year-end-1099-process-menu",
            },
         ],
         [MENU_KEYS.UPDATE_1099_FILE]: [
            {
               label: MENU_LABELS.UPDATE_1099_FILE,
               path: "/accounts-payable/ap-period/update-1099-file",
            },
         ],
         ["edit"]: [
            {
               label: MENU_LABELS.UPDATE_1099_FILE,
               path: "/accounts-payable/ap-period/update-1099-file",
            },
            {
               label: "Edit 1099 File",
               path: location.pathname,
            },
         ],
         [MENU_KEYS.AP_MAINTENANCE]: [
            {
               label: MENU_LABELS.AP_MAINTENANCE,
               path: "/accounts-payable/ap-maintenance",
            },
         ],
         [MENU_KEYS.AUTH_GENERATE]: [
            {
               label: MENU_LABELS.AUTH_GENERATE,
               path: "/accounts-payable/auth-generate",
            },
         ],
         [MENU_KEYS.OPEN_PAYABLES]: [
            {
               label: MENU_LABELS.OPEN_PAYABLES,
               path: "/accounts-payable/open-payables",
            },
         ],
         [MENU_KEYS.PAYMENT_CYCLE]: [
            {
               label: MENU_LABELS.PAYMENT_CYCLE,
               path: "/accounts-payable/payment-cycle",
            },
         ],
         [MENU_KEYS.CHECK_INQUIRY]: [
            {
               label: MENU_LABELS.CHECK_INQUIRY,
               path: "/accounts-payable/voucher-management/check-inquiry",
            },
         ],
         [MENU_KEYS.CHECK_INQUIRY_DETAIL]: [
            {
               label: MENU_LABELS.CHECK_INQUIRY,
               path: "/accounts-payable/voucher-management/check-inquiry",
            },
            {
               label: MENU_LABELS.CHECK_INQUIRY_DETAIL,
               path: "/accounts-payable/voucher-management/check-inquiry/check-details",
            },
         ],
         [MENU_KEYS.VENDOR_MANAGEMENT]: [
            {
               label: MENU_LABELS.VENDOR_MANAGEMENT,
               path: "/accounts-payable/vendor-management",
            },
         ],
         [MENU_KEYS.VENDOR_MASTER_INQUIRY]: [
            {
               label: MENU_LABELS.VENDOR_MASTER_INQUIRY,
               path: "/accounts-payable/vendor-management/vendor-maintenance",
            },
         ],
         [MENU_KEYS.VENDOR_OWNER_MAPPING]: [
            {
               label: MENU_LABELS.VENDOR_OWNER_MAPPING,
               path: "/accounts-payable/vendor-management/vendor-owner-mapping",
            },
         ],
         [MENU_KEYS.EMPLOYEE_EXPENSES_EXPORT]: [
            {
               label: MENU_LABELS.EMPLOYEE_EXPENSES_EXPORT,
               path: "/accounts-payable/employee-expenses-export",
            },
         ],
         [MENU_KEYS.CLEAR_CHECK]: [
            {
               label: MENU_LABELS.CLEAR_CHECK,
               path: "/accounts-payable/clear-checks",
            },
         ],
         ["ADD_VENDOR"]: [
            {
               label: MENU_LABELS.VENDOR_MASTER_INQUIRY,
               path: "/accounts-payable/vendor-management/vendor-maintenance",
            },
            {
               label: "Add Vendor",
               path: "/accounts-payable/vendor-management/vendor-maintenance/add-vendor",
            },
         ],
         ["EDIT_VENDOR"]: [
            {
               label: MENU_LABELS.VENDOR_MASTER_INQUIRY,
               path: "/accounts-payable/vendor-management/vendor-maintenance",
            },
            {
               label: "Edit Vendor",
               path: location.pathname,
            },
         ],
      };

      return [...base, ...(mapping[breadcrumbKey] || [])];
   }, [breadcrumbKey, location.pathname]);

   return (
      <div className="voucher-payment-container">
         <aside className={`left-menu ${collapsed ? "collapsed" : ""}`}>
            <div
               className="menu-header"
               onClick={() => setCollapsed(!collapsed)}
            >
               {collapsed ? (
                  <div className="flex-column">
                     <span className="collapse-btn">
                        <MenuOutlined />
                     </span>
                     <span className="menu-title collapsed-title">
                        {MENU_LABELS.ACCOUNTS_PAYABLE}
                     </span>
                  </div>
               ) : (
                  <div className="flex-between">
                     <span className="menu-title expanded-title">
                        {MENU_LABELS.ACCOUNTS_PAYABLE}
                     </span>
                     <span className="collapse-btn">
                        <MenuUnfoldOutlined />
                     </span>
                  </div>
               )}
            </div>

            {!collapsed && (
               <>
                  {isLoading ? (
                     // Loading state
                     <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                        <div>⏳</div>
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>Loading menu...</div>
                     </div>
                  ) : menuItems && menuItems.length === 0 ? (
                     // No access state
                     <div style={{ padding: '16px', textAlign: 'center', color: '#d32f2f' }}>
                        <div style={{ fontSize: '24px' }}>🔒</div>
                        <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: 'bold' }}>No Access</div>
                        <div style={{ fontSize: '10px', marginTop: '4px', color: '#666' }}>
                           No authorized modules available.
                        </div>
                     </div>
                  ) : (
                     // Authorized menu items
                     <Menu
                        mode="inline"
                        selectedKeys={[selected]}
                        openKeys={openKeys}
                        items={menuItems}
                        onSelect={handleSelect}
                        onOpenChange={handleOpenChange}
                     />
                  )}
               </>
            )}
         </aside>

         <main className="right-content">
            <div className="content-panel">
               <Breadcrumbs items={breadcrumbItems} />
               <Outlet />
            </div>
         </main>
      </div>
   );
};

export default AccountsPayableLayout;
