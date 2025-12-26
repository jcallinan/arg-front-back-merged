import { useCallback } from "react";
import { RoutePreloader } from "@utils/routePreloader";

// Route preloading configurations
const ROUTE_PRELOAD_CONFIG = {
  "entry-page": () => import("@modules/accounts-payable/EntryPage"),
  "voucher-management": () =>
    import("@modules/accounts-payable/voucher-management/VoucherManagement"),
  "voucher-entry": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry"
    ),
  "voucher-payable-history": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/voucher-payable-history/VoucherPayableHistory"
    ),
  "purchase-journal": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/purchase-journal/PurchaseJournal"
    ),
  "create-new-entry": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/normal/create-entry/CreateNewEntry"
    ),
  "check-inquiry": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckInquiry"
    ),
  "voucher-maintenance": () =>
    import(
      "@modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance"
    ),
  "ap-reports": () =>
    import("@modules/accounts-payable/ap-reports/ApReportsMenu"),
  "ap-period": () =>
    import("@modules/accounts-payable/ap-period/ApPeriodEnd"),
  "ap-maintenance": () =>
    import("@modules/accounts-payable/ap-maintenance/ApMaintenance"),
  "open-payables": () =>
    import("@modules/accounts-payable/open-payables/openPayables"),
  "payment-cycle": () =>
    import("@modules/accounts-payable/payment-cycle/Payment_Cycle"),
  "vendor-maintenance": () =>
    import(
      "@modules/accounts-payable/vendor-managment/vendor-master-inquiry/VendorMaster"
    ),
  "vendor-owner-mapping": () =>
    import(
      "@modules/accounts-payable/vendor-managment/vendor-owner-mapping/VendorOwner"
    ),
  "add-vendor": () =>
    import(
      "@modules/accounts-payable/vendor-managment/vendor-master-inquiry/add-vendor/AddVendor"
    ),
} as const;

type RouteKey = keyof typeof ROUTE_PRELOAD_CONFIG;

/**
 * Custom hook for route preloading
 * Provides utilities to preload routes on user interactions
 */
export const useRoutePreloading = () => {
  /**
   * Preload a specific route
   */
  const preloadRoute = useCallback((routeKey: RouteKey) => {
    const importFn = ROUTE_PRELOAD_CONFIG[routeKey];
    if (importFn) {
      RoutePreloader.preload(importFn, routeKey);
    }
  }, []);

  /**
   * Preload multiple routes
   */
  const preloadRoutes = useCallback((routeKeys: RouteKey[]) => {
    const routes = routeKeys
      .map((key) => ({
        importFn: ROUTE_PRELOAD_CONFIG[key],
        key,
      }))
      .filter(Boolean);

    RoutePreloader.preloadMultiple(routes);
  }, []);

  /**
   * Get hover props for preloading on mouse enter
   */
  const getPreloadProps = useCallback(
    (routeKey: RouteKey) => ({
      onMouseEnter: () => preloadRoute(routeKey),
      onFocus: () => preloadRoute(routeKey), // Also preload on focus for accessibility
    }),
    [preloadRoute]
  );

  /**
   * Check if a route is already preloaded
   */
  const isRoutePreloaded = useCallback((routeKey: RouteKey) => {
    return RoutePreloader.isPreloaded(routeKey);
  }, []);

  return {
    preloadRoute,
    preloadRoutes,
    getPreloadProps,
    isRoutePreloaded,
  };
};
