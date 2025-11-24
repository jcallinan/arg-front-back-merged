import "./core.scss";
import {
   BellOutlined,
   DownOutlined,
   LockOutlined,
   LogoutOutlined,
   SettingOutlined,
   UserOutlined,
} from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import mainLogo from "@assets/images/logo.svg";
import userImage from "@assets/icons/user-img.svg";
import AutoCompletes from "@widget-library/AutoComplete";
import { dataMap, tabs } from "@/staticData";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import { decryptData } from "@utils/cryptoUtils";
import type { JSX } from "react";

const Header: React.FC = (): JSX.Element => {
   const { user, logout, lastLoginResponse } = useAuth();
   const navigate = useNavigate();

   // Extract user display name from the saved API response
   const getUserDisplayName = () => {
      // First try to get from the user object (which should have decrypted data)
      if (user?.displayName) {
         return user.displayName;
      }
      if (user?.name && user.name !== "User") {
         return user.name;
      }
      
      // Fallback: try to decrypt the lastLoginResponse if needed
      if (lastLoginResponse?.items && typeof lastLoginResponse.items === 'object' && 
          'iv' in lastLoginResponse.items && 'payload' in lastLoginResponse.items) {
         try {
            const decryptedData = decryptData(lastLoginResponse.items as any);
            return decryptedData.userDisplayName || decryptedData.displayName || "User";
         } catch (error) {
            console.error('❌ Failed to decrypt user data in Header:', error);
         }
      }
      
      // Final fallback
      return lastLoginResponse?.userDisplayName || user?.name || "User";
   };
   
   const userDisplayName = getUserDisplayName();

   const handleMenuClick = async ({ key }: { key: string }) => {
      switch (key) {
         case "logout":
            logout();
            navigate("/login", { replace: true });
            break;
         case "profile":
            break;
         case "password":
            break;
         case "settings":
            break;
         default:
            break;
      }
   };

   const userMenuItems: MenuProps["items"] = [
      {
         key: "profile",
         label: "View Profile",
         icon: <UserOutlined />,
      },
      {
         key: "password",
         label: "Change Password",
         icon: <LockOutlined />,
      },
      {
         key: "settings",
         label: "Settings",
         icon: <SettingOutlined />,
      },
      {
         key: "logout",
         label: "Logout",
         icon: <LogoutOutlined />,
      },
   ];

   return (
      <header className="custom-header flex-between">
         <div className="header-left">
            <img src={mainLogo} alt="ARG Logo" className="logo" />
            <AutoCompletes id="auto-option" dataMap={dataMap} tabs={tabs} />
         </div>

         <div className="header-right flex-align">
            <BellOutlined className="icon" />

            <Dropdown
               menu={{ items: userMenuItems, onClick: handleMenuClick }}
               trigger={["click"]}
               placement="bottomRight"
               arrow={false}
               overlayClassName="customheader-user-dropdown"
            >
               <div
                  className="user-dropdown-menu flex-align"
                  style={{ cursor: "pointer" }}
               >
                  <div className="avatar">
                     <img src={userImage} alt="user image" />
                  </div>
                  <div className="user-info">
                     <span className="user-name">{userDisplayName}</span>
                  </div>
                  <DownOutlined style={{ color: "#fff" }} />
               </div>
            </Dropdown>
         </div>
      </header>
   );
};

export default Header;
