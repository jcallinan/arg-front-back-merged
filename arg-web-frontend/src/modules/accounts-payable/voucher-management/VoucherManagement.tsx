import type { FC } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const VoucherManagement: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to voucher-entry by default when visiting voucher-management
  useEffect(() => {
    if (location.pathname === "/accounts-payable/voucher-management") {
      navigate("/accounts-payable/voucher-management/voucher-entry/normal");
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
};

export default VoucherManagement;
