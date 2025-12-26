import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomStyledButton } from "@widget-library/Buttons";
import "./NoAccess.scss";

const NoAccess: React.FC = () => {
   const navigate = useNavigate();

   const handleNavigateToDashboard = () => {
      navigate("/accounts-payable");
   };

   return (
      <div className="no-access-container">
         <div className="no-access-content">
            <h1 className="no-access-title">No Access</h1>
            <p className="no-access-description">
               You do not have permission to access this page.
            </p>
            <CustomStyledButton
               name="dashboard"
               label="Dashboard"
               onClick={handleNavigateToDashboard}
            />
         </div>
      </div>
   );
};

export default NoAccess;

