import type { FC } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const AP_PeriodEnd: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to vendor-month-year-end-process by default when visiting ap-period
  useEffect(() => {
    if (location.pathname === "/accounts-payable/ap-period") {
      navigate("/accounts-payable/ap-period/vendor-month-year-end-process");
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
};

export default AP_PeriodEnd;
