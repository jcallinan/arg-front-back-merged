import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import App from "@/App";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken } from "@/utils/cookieUtils";
import { RoutePreloader } from "@utils/routePreloader";
import { PerformanceMonitor } from "@utils/performanceMonitor";

// Lazy load all components for better performance
const LoginScreen = lazy(() => import("../modules/auth/LoginScreen"));
const OAuthCallback = lazy(() => import("../modules/auth/OAuthCallback"));
const RegisterScreen = lazy(() => import("../modules/auth/RegisterScreen"));
const ForgotpasswordScreen = lazy(
   () => import("../modules/auth/ForgotpasswordScreen")
);
const NoAccess = lazy(() => import("../pages/no-access/NoAccess"));

// Main Pages
const EntryPage = lazy(() => import("../modules/accounts-payable/EntryPage"));
const AccountsPayableLayout = lazy(
   () => import("../modules/accounts-payable/AccountsPayableLayout")
);
const VoucherManagement = lazy(
   () =>
      import("../modules/accounts-payable/voucher-management/VoucherManagement")
);
const AP_ReportsMenu = lazy(
   () => import("../modules/accounts-payable/ap-reports/ApReportsMenu")
);
const AP_PeriodEnd = lazy(
   () => import("../modules/accounts-payable/ap-period/ApPeriodEnd")
);
const VendorMonthYearEndProcess = lazy(
   () =>
      import(
         "../modules/accounts-payable/ap-period/sub-modules/vendor-month-year-end/VendorMonthYearEnd"
      )
);
const VendorFileMaintenance1099 = lazy(
   () =>
      import(
         "../modules/accounts-payable/ap-period/sub-modules/vendor-file-maintenance-1099/VendorFileMaintenance1099"
      )
);
const YearEnd1099ProcessMenu = lazy(
   () =>
      import(
         "../modules/accounts-payable/ap-period/sub-modules/year-end-1099-process/YearEnd1099ProcessMenu"
      )
);
const Update1099File = lazy(
   () =>
      import(
         "../modules/accounts-payable/ap-period/sub-modules/update-1099-file/Update1099File"
      )
);
const Edit1099File = lazy(
   () =>
      import(
         "../modules/accounts-payable/ap-period/sub-modules/update-1099-file/Edit1099File"
      )
);
const AP_Maintenance = lazy(
   () => import("../modules/accounts-payable/ap-maintenance/ApMaintenance")
);
const AuthGenerate = lazy(
   () => import("../modules/accounts-payable/auth-generate/AuthGenerate")
);

// Voucher Entry Screens
const VoucherEntry = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry"
      )
);

const PurchaseJournal = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/purchase-journal/PurchaseJournal"
      )
);
const CreateNewEntry = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/normal/create-entry/CreateNewEntry"
      )
);
const CheckInquiry = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckInquiry"
      )
);
const VoucherMaintenance = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance"
      )
);
const OpenPayables = lazy(
   () => import("../modules/accounts-payable/open-payables/openPayables")
);
const PaymentCycle = lazy(
   () => import("../modules/accounts-payable/payment-cycle/Payment_Cycle")
);
const CheckDetails = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckDetails"
      )
);
const VendorMaster = lazy(
   () =>
      import(
         "../modules/accounts-payable/vendor-managment/vendor-master-inquiry/VendorMaster"
      )
);
const VendorOwner = lazy(
   () =>
      import(
         "../modules/accounts-payable/vendor-managment/vendor-owner-mapping/VendorOwner"
      )
);
const AddVendor = lazy(
   () =>
      import(
         "../modules/accounts-payable/vendor-managment/vendor-master-inquiry/add-vendor/AddVendor"
      )
);
const EmployeeExpenseExport = lazy(
   () =>
      import(
         "../modules/accounts-payable/employee-expense-export/EmployeeExpenseExport"
      )
);
const ClearChecks = lazy(
   () =>
      import(
         "../modules/accounts-payable/voucher-management/sub-modules/clear-checks/ClearChecks"
      )
);

// Lightweight loading component without pulling Ant Design
const LoadingSpinner = ({
   size = "default",
   text = "Loading...",
}: {
   size?: "small" | "default" | "large";
   text?: string;
}) => (
   <div
      style={{
         display: "flex",
         flexDirection: "column",
         justifyContent: "center",
         alignItems: "center",
         height: "100vh",
         fontSize: "14px",
         color: "#666",
         gap: "12px",
      }}
   >
      <div
         aria-label="loading"
         style={{
            width: size === "large" ? 40 : size === "small" ? 16 : 24,
            height: size === "large" ? 40 : size === "small" ? 16 : 24,
            border: "2px solid #ddd",
            borderTopColor: "#999",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
         }}
      />
      <span>{text}</span>
      <style>
         {`
         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
         `}
      </style>
   </div>
);

// Route-level Suspense wrapper for better performance with monitoring
const RouteSuspense = ({
   children,
   fallbackText = "Loading...",
   routeKey,
}: {
   children: React.ReactNode;
   fallbackText?: string;
   routeKey?: string;
}) => {
   useEffect(() => {
      if (routeKey) {
         PerformanceMonitor.startRouteLoad(routeKey);
      }
   }, [routeKey]);

   return (
      <Suspense fallback={<LoadingSpinner text={fallbackText} />}>
         <RouteContent routeKey={routeKey}>{children}</RouteContent>
      </Suspense>
   );
};

// Component to handle route content with performance monitoring
const RouteContent = ({
   children,
   routeKey,
}: {
   children: React.ReactNode;
   routeKey?: string;
}) => {
   useEffect(() => {
      if (routeKey) {
         PerformanceMonitor.endRouteLoad(routeKey);
      }
   }, [routeKey]);

   return <>{children}</>;
};

// Preload all routes during idle time, sequentially, to avoid blocking UI
const usePreloadCriticalRoutes = () => {
   useEffect(() => {
      const schedule = () =>
         RoutePreloader.preloadMultiple([
            {
               importFn: () => import("../modules/accounts-payable/EntryPage"),
               key: "entry-page",
            },
            {
               importFn: () =>
                  import("../modules/accounts-payable/AccountsPayableLayout"),
               key: "accounts-payable-layout",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/VoucherManagement"
                  ),
               key: "voucher-management",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry"
                  ),
               key: "voucher-entry",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/voucher-payable-history/VoucherPayableHistory"
                  ),
               key: "voucher-payable-history",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/purchase-journal/PurchaseJournal"
                  ),
               key: "purchase-journal",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/normal/create-entry/CreateNewEntry"
                  ),
               key: "create-new-entry",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckInquiry"
                  ),
               key: "check-inquiry",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckDetails"
                  ),
               key: "check-details",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/open-payables/openPayables"
                  ),
               key: "open-payables",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/payment-cycle/Payment_Cycle"
                  ),
               key: "payment-cycle",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-reports/ApReportsMenu"
                  ),
               key: "ap-reports",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-period/sub-modules/vendor-month-year-end/VendorMonthYearEnd"
                  ),
               key: "vendor-month-year-end",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-period/sub-modules/vendor-file-maintenance-1099/VendorFileMaintenance1099"
                  ),
               key: "vendor-file-maintenance-1099",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-period/sub-modules/year-end-1099-process/YearEnd1099ProcessMenu"
                  ),
               key: "year-end-1099-process-menu",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-period/sub-modules/update-1099-file/Update1099File"
                  ),
               key: "update-1099-file",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-period/sub-modules/update-1099-file/Edit1099File"
                  ),
               key: "edit-1099-file",
            },
            {
               importFn: () =>
                  import("../modules/accounts-payable/ap-period/ApPeriodEnd"),
               key: "ap-period",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/ap-maintenance/ApMaintenance"
                  ),
               key: "ap-maintenance",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/vendor-managment/vendor-master-inquiry/VendorMaster"
                  ),
               key: "vendor-maintenance",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/vendor-managment/vendor-owner-mapping/VendorOwner"
                  ),
               key: "vendor-owner-mapping",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/vendor-managment/vendor-master-inquiry/add-vendor/AddVendor"
                  ),
               key: "add-vendor",
            },
            {
               importFn: () => import("../modules/auth/LoginScreen"),
               key: "login",
            },
            {
               importFn: () => import("../modules/auth/OAuthCallback"),
               key: "oauth-callback",
            },
            {
               importFn: () => import("../modules/auth/RegisterScreen"),
               key: "register",
            },
            {
               importFn: () => import("../modules/auth/ForgotpasswordScreen"),
               key: "forgot-password",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/employee-expense-export/EmployeeExpenseExport"
                  ),
               key: "employee-expenses-export",
            },
            {
               importFn: () =>
                  import(
                     "../modules/accounts-payable/voucher-management/sub-modules/clear-checks/ClearChecks"
                  ),
               key: "clear-checks",
            },
         ]);

      if ("requestIdleCallback" in window) {
         (
            window as Window & {
               requestIdleCallback: (
                  callback: () => void,
                  options?: { timeout: number }
               ) => void;
            }
         ).requestIdleCallback(schedule, { timeout: 2000 });
      } else {
         setTimeout(schedule, 300);
      }

      return () => {
         // no-op cleanup for requestIdleCallback since we don't keep the id here
      };
   }, []);
};

// Login Route Guard Component
const LoginRoute = () => {
   // Check if access token exists in cookies
   const hasAccessToken = getAccessToken() !== null;
   
   // If already authenticated, redirect to accounts-payable
   if (hasAccessToken) {
      return <Navigate to="/accounts-payable" replace />;
   }
   
   return (
      <RouteSuspense fallbackText="Loading login..." routeKey="login">
         <LoginScreen />
      </RouteSuspense>
   );
};

export default function AppRoutes() {
   // Preload critical routes when the app starts
   usePreloadCriticalRoutes();
   
   // Check if access token exists in cookies
   const hasAccessToken = getAccessToken() !== null;

   return (
      <Routes>
         {/* Public Routes */}
         <Route path="/login" element={<LoginRoute />} />
         <Route
            path="/auth/callback"
            element={
               <RouteSuspense
                  fallbackText="Completing authentication..."
                  routeKey="oauth-callback"
               >
                  <OAuthCallback />
               </RouteSuspense>
            }
         />
         <Route
            path="/register"
            element={
               <RouteSuspense
                  fallbackText="Loading registration..."
                  routeKey="register"
               >
                  <RegisterScreen />
               </RouteSuspense>
            }
         />
         <Route
            path="/forgot-password"
            element={
               <RouteSuspense
                  fallbackText="Loading password reset..."
                  routeKey="forgot-password"
               >
                  <ForgotpasswordScreen />
               </RouteSuspense>
            }
         />

         {/* Root redirect */}
         <Route 
            path="/" 
            element={
               hasAccessToken ? 
               <Navigate to="/accounts-payable" replace /> : 
               <Navigate to="/login" replace />
            } 
         />

         {/* All Protected Routes */}
         <Route path="/*" element={
            <ProtectedRoute>
               <App />
            </ProtectedRoute>
         }>
            <Route
               index
               element={<Navigate to="/accounts-payable" replace />}
            />

            {/* No Access Route */}
            <Route
               path="no-access"
               element={
                  <RouteSuspense
                     fallbackText="Loading..."
                     routeKey="no-access"
                  >
                     <NoAccess />
                  </RouteSuspense>
               }
            />

            {/* Accounts Payable Routes */}
            <Route path="accounts-payable">
               {/* Main accounts-payable route without sidebar */}
               <Route
                  index
                  element={
                     <RouteSuspense
                        fallbackText="Loading accounts payable..."
                        routeKey="entry-page"
                     >
                        <EntryPage />
                     </RouteSuspense>
                  }
               />

               {/* All other accounts-payable routes with sidebar */}
               <Route
                  path="*"
                  element={
                     <RouteSuspense
                        fallbackText="Loading accounts payable..."
                        routeKey="accounts-payable-layout"
                     >
                        <AccountsPayableLayout />
                     </RouteSuspense>
                  }
               >
                  {/* Voucher Management Routes */}
                  <Route
                     path="voucher-management"
                     element={
                        <RouteSuspense
                           fallbackText="Loading voucher management..."
                           routeKey="voucher-management"
                        >
                           <VoucherManagement />
                        </RouteSuspense>
                     }
                  >
                     {/* Default route for voucher-management redirects to normal process */}
                     <Route
                        index
                        element={<Navigate to="voucher-entry/normal" replace />}
                     />

                     {/* Redirect old voucher-entry route to normal process */}
                     <Route
                        path="voucher-entry"
                        element={<Navigate to="voucher-entry/normal" replace />}
                     />
                     <Route
                        path="voucher-entry/:id"
                        element={
                           <RouteSuspense
                              fallbackText="Loading voucher entry..."
                              routeKey="voucher-entry"
                           >
                              <VoucherEntry />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="voucher-entry/:id/create-new-entry"
                        element={
                           <RouteSuspense
                              fallbackText="Loading create entry..."
                              routeKey="create-new-entry"
                           >
                              <CreateNewEntry />
                           </RouteSuspense>
                        }
                     />
                     {/* Redirect old create-new-entry route to normal process */}
                     <Route
                        path="voucher-entry/create-new-entry"
                        element={
                           <Navigate to="normal/create-new-entry" replace />
                        }
                     />
                     <Route
                        path="purchase-journal"
                        element={
                           <RouteSuspense
                              fallbackText="Loading purchase journal..."
                              routeKey="purchase-journal"
                           >
                              <PurchaseJournal />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="check-inquiry"
                        element={
                           <RouteSuspense
                              fallbackText="Loading check inquiry..."
                              routeKey="check-inquiry"
                           >
                              <CheckInquiry />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="check-inquiry/check-details/:checkNo"
                        element={
                           <RouteSuspense
                              fallbackText="Loading check details..."
                              routeKey="check-details"
                           >
                              <CheckDetails />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="voucher-maintenance"
                        element={
                           <RouteSuspense
                              fallbackText="Loading voucher maintenance..."
                              routeKey="voucher-maintenance"
                           >
                              <VoucherMaintenance />
                           </RouteSuspense>
                        }
                     />
                  </Route>

                  {/* Direct Accounts Payable Routes */}
                  <Route
                     path="open-payables"
                     element={
                        <RouteSuspense
                           fallbackText="Loading open payables..."
                           routeKey="open-payables"
                        >
                           <OpenPayables />
                        </RouteSuspense>
                     }
                  />
                  <Route
                     path="payment-cycle"
                     element={
                        <RouteSuspense
                           fallbackText="Loading payment cycle..."
                           routeKey="payment-cycle"
                        >
                           <PaymentCycle />
                        </RouteSuspense>
                     }
                  />
                  <Route
                     path="employee-expenses-export"
                     element={
                        <RouteSuspense
                           fallbackText="Loading employee expense export..."
                           routeKey="employee-expenses-export"
                        >
                           <EmployeeExpenseExport />
                        </RouteSuspense>
                     }
                  />
                  <Route
                     path="clear-checks"
                     element={
                        <RouteSuspense
                           fallbackText="Loading clear checks..."
                           routeKey="clear-checks"
                        >
                           <ClearChecks />
                        </RouteSuspense>
                     }
                  />

                  {/* Vendor Management Routes */}
                  <Route path="vendor-management">
                     <Route
                        index
                        element={
                           <RouteSuspense
                              fallbackText="Loading vendor maintenance..."
                              routeKey="vendor-maintenance"
                           >
                              <VendorMaster />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="vendor-maintenance"
                        element={
                           <RouteSuspense
                              fallbackText="Loading vendor maintenance..."
                              routeKey="vendor-maintenance"
                           >
                              <VendorMaster />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="vendor-owner-mapping"
                        element={
                           <RouteSuspense
                              fallbackText="Loading vendor owner mapping..."
                              routeKey="vendor-owner-mapping"
                           >
                              <VendorOwner />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="vendor-maintenance/add-vendor"
                        element={
                           <RouteSuspense
                              fallbackText="Loading add vendor..."
                              routeKey="add-vendor"
                           >
                              <AddVendor mode="add" />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="vendor-maintenance/edit-vendor/:vendorNo"
                        element={
                           <RouteSuspense
                              fallbackText="Loading edit vendor..."
                              routeKey="add-vendor"
                           >
                              <AddVendor mode="edit" />
                           </RouteSuspense>
                        }
                     />
                  </Route>

                  {/* AP Period Routes */}
                  <Route
                     path="ap-period"
                     element={
                        <RouteSuspense
                           fallbackText="Loading AP period..."
                           routeKey="ap-period"
                        >
                           <AP_PeriodEnd />
                        </RouteSuspense>
                     }
                  >
                     {/* Default route for ap-period redirects to vendor-month-year-end-process */}
                     <Route
                        index
                        element={
                           <Navigate
                              to="vendor-month-year-end-process"
                              replace
                           />
                        }
                     />
                     <Route
                        path="vendor-month-year-end-process"
                        element={
                           <RouteSuspense
                              fallbackText="Loading vendor month/year end process..."
                              routeKey="vendor-month-year-end-process"
                           >
                              <VendorMonthYearEndProcess />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="vendor-file-maintenance-1099"
                        element={
                           <RouteSuspense
                              fallbackText="Loading vendor file maintenance for 1099..."
                              routeKey="vendor-file-maintenance-1099"
                           >
                              <VendorFileMaintenance1099 />
                           </RouteSuspense>
                        }
                     />
                     <Route
                        path="year-end-1099-process-menu"
                        element={
                           <RouteSuspense
                              fallbackText="Loading year end 1099 process menu..."
                              routeKey="year-end-1099-process-menu"
                           >
                              <YearEnd1099ProcessMenu />
                           </RouteSuspense>
                        }
                     />
                     <Route path="update-1099-file">
                        <Route
                           index
                           element={
                              <RouteSuspense
                                 fallbackText="Loading update 1099 file..."
                                 routeKey="update-1099-file"
                              >
                                 <Update1099File />
                              </RouteSuspense>
                           }
                        />
                        <Route
                           path="edit"
                           element={
                              <RouteSuspense
                                 fallbackText="Loading edit 1099 file..."
                                 routeKey="edit-1099-file"
                              >
                                 <Edit1099File />
                              </RouteSuspense>
                           }
                        />
                     </Route>
                  </Route>

                  {/* Other Direct Routes */}
                  <Route
                     path="ap-reports"
                     element={
                        <RouteSuspense
                           fallbackText="Loading AP reports..."
                           routeKey="ap-reports"
                        >
                           <AP_ReportsMenu />
                        </RouteSuspense>
                     }
                  />
                  <Route
                     path="ap-maintenance"
                     element={
                        <RouteSuspense
                           fallbackText="Loading AP maintenance..."
                           routeKey="ap-maintenance"
                        >
                           <AP_Maintenance />
                        </RouteSuspense>
                     }
                  />
                  <Route
                     path="auth-generate"
                     element={
                        <RouteSuspense
                           fallbackText="Loading auth generate..."
                           routeKey="auth-generate"
                        >
                           <AuthGenerate />
                        </RouteSuspense>
                     }
                  />

                  {/* Catch-all for undefined accounts-payable sub-routes */}
                  <Route
                     path="*"
                     element={<Navigate to="/accounts-payable" replace />}
                  />
               </Route>
            </Route>
         </Route>

         {/* Catch-all route for non-existent URLs - redirect to accounts-payable if authenticated, otherwise login */}
         <Route 
            path="*" 
            element={
               hasAccessToken ? 
               <Navigate to="/accounts-payable" replace /> : 
               <Navigate to="/login" replace />
            } 
         />
      </Routes>
   );
}
