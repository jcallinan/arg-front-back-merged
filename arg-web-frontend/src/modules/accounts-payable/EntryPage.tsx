import {
  FileTextOutlined,
  FileSyncOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  WalletOutlined,
  LineChartOutlined,
  TeamOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import "./entrypage.scss";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { AP_TITLE } from "@constants/commonConstants";
import { useRoutePreloading } from "@hooks/useRoutePreloading";
import { useAuth } from "@modules/auth/customhooks/useAuth";
import { 
  generateCardsFromBackendNavigation, 
  getIconIndexForCard
} from "@utils/navigationCardGenerator";
import { extractNavigationData } from "@utils/permissionUtils";

const icons = [
  <FileTextOutlined />,     // 0 - Voucher Entry
  <FileSyncOutlined />,     // 1 - Purchase Journal  
  <CreditCardOutlined />,   // 2 - Check Inquiry
  <IdcardOutlined />,       // 3 - Open Payables
  <WalletOutlined />,       // 4 - Payment Cycle
  <SnippetsOutlined />,     // 5 - Employee Expense Export
  <TeamOutlined />,         // 6 - Clear Checks
  <FileTextOutlined />,     // 7 - Vendor Management
  <LineChartOutlined />,    // 8 - A/P Reports Menu
  <FileSyncOutlined />,     // 9 - A/P Period End
  <SnippetsOutlined />,     // 10 - A/P Maintenance
  <FileTextOutlined />,     // 11 - Voucher Maintenance
  <TeamOutlined />,         // 12 - Vendor Owner Mapping
  <IdcardOutlined />,       // 13 - Auth Generate
];

const EntryPage = () => {
  const navigate = useNavigate();
  const { getPreloadProps } = useRoutePreloading();
  const { lastLoginResponse } = useAuth();

  // Generate cards directly from backend navigation data
  const authorizedCards = useMemo(() => {
    if (!lastLoginResponse) {
      console.log('⏳ No auth response yet, showing no cards');
      return [];
    }

    // Extract navigation data from the decrypted auth response
    const navigationData = extractNavigationData(lastLoginResponse);
    
    if (navigationData.length === 0) {
      console.log('🔒 No navigation data found in auth response');
      return [];
    }

    // Generate cards directly from backend navigation data
    const backendCards = generateCardsFromBackendNavigation(navigationData);
    return backendCards;
  }, [lastLoginResponse]);

 

  // Map route keys to preload keys
  const getPreloadKey = (route: string) => {
    const routeMap: Record<string, string> = {
      "voucher-management/voucher-entry/normal": "voucher-entry",
      "voucher-management/purchase-journal": "purchase-journal",
      "voucher-management/check-inquiry": "check-inquiry",
      "open-payables": "open-payables",
      "payment-cycle": "payment-cycle",
      "employee-expenses-export": "employee-expenses-export",
      "clear-checks": "clear-checks",
      "vendor-management/vendor-maintenance": "vendor-maintenance",
      "ap-reports": "ap-reports",
      "ap-period": "ap-period",
      "ap-maintenance": "ap-maintenance",
    };
    return routeMap[route] || null;
  };

  return (
    <div className="EntryPage-container">
      <h2>{AP_TITLE}</h2>
      {authorizedCards.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '40vh',
          flexDirection: 'column',
          gap: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px' }}>🔒</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
            No Access
          </div>
          <div style={{ fontSize: '16px', color: '#666', maxWidth: '400px' }}>
            You don't have permission to access any Accounts Payable modules. Please contact your administrator.
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {authorizedCards.map((card) => {
            // Get the appropriate icon for this card based on its permission
            const iconIndex = getIconIndexForCard(card.permission);
            const preloadKey = card.route ? getPreloadKey(card.route) : null;
            const preloadProps = preloadKey
              ? getPreloadProps(
                  preloadKey as Parameters<typeof getPreloadProps>[0]
                )
              : {};

            return (
              <div
                className="entrypage-card"
                key={`${card.rightsId}-${card.permission}`}
                onClick={() =>
                  card.route && navigate(`/accounts-payable/${card.route}`)
                }
                style={{ cursor: card.route ? "pointer" : "default" }}
                {...preloadProps}
              >
                <p className="icon ">{icons[iconIndex]}</p>
                <p className="ap-card-title">{card.title}</p>
                <p className="p-s ap-card-description">{card.desc}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EntryPage;
