import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./core.scss";
import type { SideMenuitem } from "./core.type";
import AccountPayableOutlined from "@assets/icons/account-payable-outlined.svg";
import AssetOutlined from "@assets/icons/asset-outlined.svg";
import BillingOutlined from "@assets/icons/billing-outlined.svg";
import BarChartOutlined from "@assets/icons/bar-chart-outlined.svg";
import CostingOutlined from "@assets/icons/costing-outlined.svg";
import CreditCardOutlined from "@assets/icons/credit-card-outlined.svg";
import FileTextOutlined from "@assets/icons/file-text-outlined.svg";
import LedgerOutlined from "@assets/icons/ledger-outlined.svg";
import ProfileOutlined from "@assets/icons/profile-outlined.svg";
import QueryOutlined from "@assets/icons/query-outlined.svg";
import TransportOutlined from "@assets/icons/transport-outlined.svg";
import { MenuFoldOutlined, MenuOutlined } from "@ant-design/icons";
import { useRoutePreloading } from "@hooks/useRoutePreloading";
import { useAuth } from "@modules/auth/customhooks/useAuth";
import { extractNavigationData, findNodeByDisplayName } from "@utils/permissionUtils";
import { notification } from "antd";

const menuItems: SideMenuitem[] = [
   {
      key: "/order-invoice",
      icon: <img src={FileTextOutlined} alt="Order/Invoice/Product Moves" />,
      label: "Order/Invoice/Product Moves",
   },
   {
      key: "/accounts-receivable",
      icon: <img src={CreditCardOutlined} alt="Accounts Receivable" />,
      label: "Accounts Receivable",
   },
   {
      key: "/sales-analysis",
      icon: <img src={BarChartOutlined} alt="Sales Analysis" />,
      label: "Sales Analysis",
   },
   {
      key: "/inventory",
      icon: <img src={ProfileOutlined} alt="Inventory" />,
      label: "Inventory",
   },
   {
      key: "/billing-freight",
      icon: <img src={BillingOutlined} alt="Billing Freight" />,
      label: "Billing Freight",
   },
   {
      key: "/transportation",
      icon: <img src={TransportOutlined} alt="Transportation" />,
      label: "Transportation",
   },
   {
      key: "/accounts-payable",
      icon: <img src={AccountPayableOutlined} alt="Accounts Payable" />,
      label: "Accounts Payable",
   },
   {
      key: "/fixed-assets",
      icon: <img src={AssetOutlined} alt="Fixed Assets" />,
      label: "Fixed Assets",
   },
   {
      key: "/general-ledger",
      icon: <img src={LedgerOutlined} alt="General Ledger" />,
      label: "General Ledger",
   },
   {
      key: "/inventory-costing",
      icon: <img src={CostingOutlined} alt="Inventory Costing" />,
      label: "Inventory Costing",
   },
   {
      key: "/work-query",
      icon: <img src={QueryOutlined} alt="Work with Query" />,
      label: "Work with Query",
   },
];

const Sidebar: React.FC = () => {
   const [collapsed, setCollapsed] = useState<boolean>(true);
   const location = useLocation();
   const navigate = useNavigate();
   const { getPreloadProps } = useRoutePreloading();
   const [api, contextHolder] = notification.useNotification();
   
   // Get auth data and navigation permissions
   let authData;
   try {
      authData = useAuth();
   } catch (error) {
      console.error("❌ Sidemenu: useAuth failed:", error);
      // During development, provide fallback
      if (process.env.NODE_ENV === 'development') {
         authData = { lastLoginResponse: null, isLoading: false };
      } else {
         throw error;
      }
   }
   const { lastLoginResponse, isLoading } = authData;

   // Route mapping from API navigation names to existing routes
   // Note: Currently only /accounts-payable is fully implemented in Approutes.tsx
   /*
  const routeMapping: Record<string, string> = {
      // Main module mappings - these are the top-level permissions that enable access to modules
      'account_payable::read': '/accounts-payable',
      'general_ledger::read': '/general-ledger',
      'accounts_receivable::read': '/accounts-receivable',
      'inventory::read': '/inventory',
      'fixed_assets::read': '/fixed-assets',
      'sales_analysis::read': '/sales-analysis',
      'billing_freight::read': '/billing-freight',
      'transportation::read': '/transportation',
      'inventory_costing::read': '/inventory-costing',
      'work_query::read': '/work-query',
      'order_invoice::read': '/order-invoice',
      
      // Alternative naming patterns (without permissions)
      'account_payable': '/accounts-payable',
      'general_ledger': '/general-ledger',
      'accounts_receivable': '/accounts-receivable',
      'inventory': '/inventory',
      'fixed_assets': '/fixed-assets',
      'sales_analysis': '/sales-analysis',
      'billing_freight': '/billing-freight',
      'transportation': '/transportation',
      'inventory_costing': '/inventory-costing',
      'work_query': '/work-query',
      'order_invoice': '/order-invoice',
      
      // Case variations
      'Account_Payable': '/accounts-payable',
      'General_Ledger': '/general-ledger',
      'Accounts_Receivable': '/accounts-receivable',
      'Inventory': '/inventory',
      'Fixed_Assets': '/fixed-assets',
      'Sales_Analysis': '/sales-analysis',
      'Billing_Freight': '/billing-freight',
      'Transportation': '/transportation',
      'Inventory_Costing': '/inventory-costing',
      'Work_Query': '/work-query',
      'Order_Invoice': '/order-invoice',
      
      // Display name variations
      'Account Payables': '/accounts-payable',
      'Accounts Payable': '/accounts-payable',
      'General Ledger': '/general-ledger',
      'Accounts Receivable': '/accounts-receivable',
      'Fixed Assets': '/fixed-assets',
      'Sales Analysis': '/sales-analysis',
      'Billing Freight': '/billing-freight',
      'Inventory Costing': '/inventory-costing',
      'Work Query': '/work-query',
      'Order Invoice': '/order-invoice',
   };
   */

   // Filter menu items based on backend navigation data
   const authorizedMenuItems = useMemo(() => {
      

      // Extract navigation data from the hierarchical response
      const navigationData = extractNavigationData(lastLoginResponse);
      
     

      // Find the ARG Main Board node and get its children (top-level modules)
      const mainBoardNode = findNodeByDisplayName(navigationData, 'Dashboard');
      
      if (!mainBoardNode || !mainBoardNode.children) {
         console.warn('⚠️ ARG Main Board node not found or has no children');
         return [];
      }

      const topLevelModules = mainBoardNode.children;
      

      // Map backend DisplayNames to frontend menu keys
      const displayNameToMenuKey: Record<string, string> = {
         'Account Payables': '/accounts-payable',
         'Accounts Receivable': '/accounts-receivable', 
         'General Ledger': '/general-ledger',
         'Inventory': '/inventory',
         'Fixed Assets': '/fixed-assets',
         'Sales Analysis': '/sales-analysis',
         'Billing Freight': '/billing-freight',
         'Transportation': '/transportation',
         'Inventory Costing': '/inventory-costing',
         'Work Query': '/work-query',
         'Order Invoice': '/order-invoice',
      };

      // Filter menu items based on what's available in backend navigation
      const authorizedItems = menuItems.filter(menuItem => {
         // Find if this menu item corresponds to any backend module
         const matchingModule = topLevelModules.find((module: any) => {
            const expectedMenuKey = displayNameToMenuKey[module.DisplayName];
            return expectedMenuKey === menuItem.key;
         });

         const isAuthorized = !!matchingModule;
         
         
         return isAuthorized;
      });

      return authorizedItems;
   }, [lastLoginResponse]);

   const handleMenuClick = (item: SideMenuitem) => {
      // Currently only accounts-payable is fully implemented
      if (item.key === '/accounts-payable') {
         navigate(item.key);
      } else {
         // For other modules that aren't implemented yet, show a notification
      
         api.info({
            message: 'Coming Soon',
            description: `${item.label} module is coming soon!`,
            placement: 'topRight',
            duration: 3,
         });
      }
   };

   return (
      <>
         {contextHolder}
         <div
            className={`custom-sidebar ${collapsed ? "collapsed" : ""}`}
            data-testid="sidebar"
         >
            <div
               className="toggle-button"
               onClick={() => setCollapsed(!collapsed)}
               data-testid="toggle-button"
            >
               {collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
            </div>

         <ul className="menu" data-testid="menu-list">
            {isLoading ? (
               // Loading state
               <li className="menu-item loading-item">
                  <span className="icon">⏳</span>
                  {!collapsed && (
                     <h5 className="label p-s">Loading menu...</h5>
                  )}
               </li>
            ) : authorizedMenuItems.length === 0 ? (
               // No authorized modules
               <li className="menu-item no-access-item">
                  <span className="icon">🔒</span>
                  {!collapsed && (
                     <div className="no-access-content">
                        <h5 className="label p-s">No Access</h5>
                        <p style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                           No authorized modules available.
                        </p>
                     </div>
                  )}
               </li>
            ) : (
               // Authorized menu items
               authorizedMenuItems.map((item) => {
                  // Get preload props for accounts-payable route
                  const preloadProps =
                     item.key === "/accounts-payable"
                        ? getPreloadProps("entry-page")
                        : {};

                  return (
                     <li
                        key={item.key}
                        className={`menu-item ${
                           location.pathname.includes(item.key) ? "active" : ""
                        }`}
                        data-testid={`menu-item-${item.key.replace("/", "")}`}
                        onClick={() => handleMenuClick(item)}
                        {...preloadProps}
                     >
                        <span className="icon">{item.icon}</span>
                        {!collapsed && (
                           <h5 className="label p-s ">{item.label}</h5>
                        )}
                     </li>
                  );
               })
            )}
         </ul>
         </div>
      </>
   );
};

export default Sidebar;
