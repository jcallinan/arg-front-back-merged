import { formatCurrency } from "@utils/formatters";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
   CHECK_INQUIRY,
   FLEXI_PROCESS_CONSTANTS,
} from "@constants/commonConstants";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import VendorNumberName, {
   type VendorNumberNameRef,
} from "@shared-components/vendor-number-name/VendorNumberName";
import { Tooltip } from "antd";
import { CustomStyledButton } from "@widget-library/Buttons";
import CustomDatePicker from "@widget-library/DatePicker";
import { CustomPrefixInput } from "@widget-library/Input";
import { EyeOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./check-inquiry.scss";
import companyIcon from "@assets/icons/company-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import openpayables from "@assets/icons/openpayable.svg";
import paidAmountIcon from "@assets/icons/last-paid-card-icon.svg";
import calendarIcon from "@assets/icons/calender-icon.svg";
import Card from "@widget-library/Card";
import TableWidget from "@widget-library/Table";
import Toaster from "@widget-library/Toaster";
import type { CheckPaymentHistoryUI } from "@type-definitions/accounts-payable.types";
import type { ColumnType } from "antd/es/table";

import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { usePaymentHistory, useLastPaymentInfo, usePaymentHistoryManual } from "@hooks/useCheckInquiry";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";
import {
  createPaidDateSorter,
  createCheckNumberSorter,
  createInvoiceNumberSafeSorter,
  createInvoiceDescriptionSorter,
  createGrossAmountSorter,
  createDiscountAmountSorter,
  createStatusSafeSorter
} from "@utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@utils/tableFilters";

const CheckEnquiry: React.FC = () => {
   const [companyNo, setCompanyNo] = useState("10");
   const [vendor, setVendor] = useState<string | undefined>();
   const [vendorName, setVendorName] = useState<string>("");
   const [startDate, setStartDate] = useState<string | null>(null);
   const [invoiceNo, setInvoiceNo] = useState("");
   const [checkNo, setCheckNo] = useState("");
   // State for search trigger and stable search parameters
   const [shouldFetch, setShouldFetch] = useState(false);
   const [apiSearchParams, setApiSearchParams] = useState<{
      paymentHistory: any;
      lastPaymentInfo: any;
   }>({
      paymentHistory: {},
      lastPaymentInfo: {},
   });
   
   // Current form parameters (these change as user types but don't trigger queries)
   const currentPaymentHistoryParams = {
      companyNo: Number(companyNo),
      vendorNo: Number(vendor),
      ...(startDate && {
         startDate: dayjs(startDate).format("MMDDYY"),
      }),
      ...(invoiceNo && { invoiceNo }),
      ...(checkNo && { checkNo: Number(checkNo) }),
      current_page: 1,
      items_per_page: 500,
   };

   const currentLastPaymentInfoParams = {
      companyNo: Number(companyNo),
      vendorNo: Number(vendor),
      ...(startDate && {
         startDate: dayjs(startDate).format("MMDDYY"),
      }),
      ...(invoiceNo && { invoiceNo }),
      ...(checkNo && { checkNo: Number(checkNo) }),
   };

   // React Query hooks with stable parameters (only change when search is triggered)
   const {
      data: checkPaymentData = [],
      isLoading: loading,
      refetch: refetchPaymentHistory,
   } = usePaymentHistory(apiSearchParams.paymentHistory, false); // Always disabled, only manual refetch

   // Local state to support dynamic pagination beyond 50 pages
   const [allCheckPaymentData, setAllCheckPaymentData] = useState<CheckPaymentHistoryUI[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [hasMoreServerPages, setHasMoreServerPages] = useState(true);
   const serverItemsPerPage = 500;
   const { fetchPaymentHistory } = usePaymentHistoryManual();

   const {
      data: lastPaymentInfo = {},
      isLoading: cardDataLoading,
      refetch: refetchLastPaymentInfo,
   } = useLastPaymentInfo(apiSearchParams.lastPaymentInfo, false); // Always disabled, only manual refetch

   // Toaster state
   const [showToaster, setShowToaster] = useState<boolean>(false);
   const [toasterType, setToasterType] = useState<
      "error" | "success" | "warning" | "batch"
   >("error");
   const [toasterMessage, setToasterMessage] = useState<string>("");
   const [toasterDescription, setToasterDescription] = useState<string>("");

   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
   const location = useLocation();

   const vendorRef = useRef<VendorNumberNameRef | null>(null);
   const isRestoringStateRef = useRef(false);
   const isRestoringFromSessionRef = useRef(false);

   // SessionStorage key for this route
   const SESSION_STORAGE_KEY = "check_inquiry_retained_data";
   const ACTIVE_SESSION_KEY = "check_inquiry_active_session";

   // Handle vendor selection and update vendor name immediately
   const handleVendorChange = useCallback((selectedVendor: string | undefined) => {
      setVendor(selectedVendor);
      
      // Get vendor name immediately from the VendorNumberName component
      if (selectedVendor && vendorRef.current) {
         const name = vendorRef.current.getVendorName(selectedVendor);
         setVendorName(name || "");
      } else {
         setVendorName("");
      }
   }, []);

   // Toaster close handler
   const closeToaster = useCallback(() => {
      setShowToaster(false);
   }, []);

   // Helper function to show toaster
   const showToasterMessage = useCallback(
      (
         type: "error" | "success" | "warning" | "batch",
         title: string,
         description: string
      ) => {
         setToasterType(type);
         setToasterMessage(title);
         setToasterDescription(description);
         setShowToaster(true);
      },
      []
   );

   // Save complete state to sessionStorage
   const saveCompleteState = useCallback(() => {
      const stateToSave = {
         formData: {
            companyNo,
            vendor,
            vendorName,
            startDate,
            invoiceNo,
            checkNo,
         },
         tableData: checkPaymentData,
         cardData: lastPaymentInfo,
         shouldFetch,
         apiSearchParams,
         timestamp: Date.now(), // To track when data was saved
      };

      try {
         sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify(stateToSave)
         );
         sessionStorage.setItem(ACTIVE_SESSION_KEY, "true");
      } catch (error) {
         console.warn("Failed to save state to sessionStorage:", error);
      }
   }, [
      companyNo,
      vendor,
      vendorName,
      startDate,
      invoiceNo,
      checkNo,
      checkPaymentData,
      lastPaymentInfo,
      shouldFetch,
      apiSearchParams,
      SESSION_STORAGE_KEY,
      ACTIVE_SESSION_KEY,
   ]);

   // Restore complete state from sessionStorage
   const restoreCompleteState = useCallback(() => {
      try {
         const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
         if (savedState) {
            const parsedState = JSON.parse(savedState);
            const { formData, shouldFetch: savedShouldFetch, apiSearchParams: savedApiSearchParams } = parsedState;

            // Set flag to prevent URL param saving during restoration
            isRestoringFromSessionRef.current = true;
            isRestoringStateRef.current = true;

            // Restore form data
            if (formData.companyNo) setCompanyNo(formData.companyNo);
            if (formData.vendor) setVendor(formData.vendor);
            if (formData.vendorName) setVendorName(formData.vendorName);
            if (formData.startDate) setStartDate(formData.startDate);
            if (formData.invoiceNo) setInvoiceNo(formData.invoiceNo);
            if (formData.checkNo) setCheckNo(formData.checkNo);

            // Restore shouldFetch state
            if (savedShouldFetch !== undefined) {
               setShouldFetch(savedShouldFetch);
            }

            // Restore API search parameters
            if (savedApiSearchParams) {
               setApiSearchParams(savedApiSearchParams);
            }

            // Note: tableData and cardData will be handled by React Query hooks
            // based on the restored form data and shouldFetch state

            // Restore URL parameters to match the restored form data
            const urlParams = new URLSearchParams();
            if (formData.companyNo)
               urlParams.set("companyNo", formData.companyNo);
            if (formData.vendor) urlParams.set("vendor", formData.vendor);
            if (formData.startDate)
               urlParams.set("startDate", formData.startDate);
            if (formData.invoiceNo)
               urlParams.set("invoiceNo", formData.invoiceNo);
            if (formData.checkNo) urlParams.set("checkNo", formData.checkNo);

            // Update URL without triggering navigation
            setSearchParams(urlParams);

            // Reset flags after a short delay
            setTimeout(() => {
               isRestoringFromSessionRef.current = false;
               isRestoringStateRef.current = false;
            }, 200);

            return true;
         }
      } catch (error) {
         console.warn("Failed to restore state from sessionStorage:", error);
      }
      return false;
   }, [SESSION_STORAGE_KEY, setSearchParams]);

   // Clear stored state from sessionStorage
   const clearStoredState = useCallback(() => {
      try {
         sessionStorage.removeItem(SESSION_STORAGE_KEY);
         sessionStorage.removeItem(ACTIVE_SESSION_KEY);
         sessionStorage.removeItem("check_inquiry_unmounting");
      } catch (error) {
         console.warn("Failed to clear stored state:", error);
      }
   }, [SESSION_STORAGE_KEY, ACTIVE_SESSION_KEY]);

   function handleViewClick(record: CheckPaymentHistoryUI): void {
      if (record.checkNo) {
         // Save current state before navigating (both URL params and complete state)
         saveCurrentState();
         saveCompleteState();

         const companyQuery = encodeURIComponent(companyNo ?? "");
         const vendorQuery = encodeURIComponent(vendor ?? "");
         navigate(
            `/accounts-payable/voucher-management/check-inquiry/check-details/${record.checkNo}?companyNo=${companyQuery}&vendorNo=${vendorQuery}`,
            {
               state: {
                  companyNo: Number(companyNo),
                  vendorNo: vendor ? Number(vendor) : undefined,
                  // Pass back URL to return to with state preserved
                  returnUrl: `/accounts-payable/voucher-management/check-inquiry${location.search}`,
                  fromCheckInquiry: true, // Flag to indicate we came from check inquiry
               },
            }
         );
      }
   }

   const columns: (ColumnType<CheckPaymentHistoryUI> & {
      filterable?: boolean;
   })[] = [
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.actions,
         dataIndex: "",
         fixed: "left",
         align: "center",
         render: (_, record) => (
            <div className="action-icons flex-all">
               <Tooltip title="View">
                  <EyeOutlined
                     className="action-icon"
                     onClick={() => handleViewClick(record)}
                  />
               </Tooltip>
            </div>
         ),
      },

      {
         title: "Check Paid Date",
         dataIndex: "paidDate",
         key: "paidDate",
         ...getColumnSearchProps("paidDate", "Search Paid Date"),
         sorter: createPaidDateSorter("paidDate"),
        
      },
      {
         title: "Check No",
         dataIndex: "checkNo",
         key: "checkNo",
         ...createNumericFilter("checkNo", "Enter Check No"),
         sorter: createCheckNumberSorter("checkNo"),
      },
      {
         title: "Invoice No",
         dataIndex: "invoiceNo",
         key: "invoiceNo",
         ...getColumnSearchProps("invoiceNo", "Search Invoice No"),
         sorter: createInvoiceNumberSafeSorter("invoiceNo"),
      },
      {
         title: "Invoice Description",
         dataIndex: "invoiceDescription",
         key: "invoiceDescription",
         ...getColumnSearchProps("invoiceDescription", "Search Description"),
         sorter: createInvoiceDescriptionSorter("invoiceDescription"),
      },
      {
         title: "Gross Amount",
         dataIndex: "grossAmount",
         key: "grossAmount",
         align: "right",
         ...getColumnSearchProps("grossAmount", "Enter Gross Amount", true),
         sorter: createGrossAmountSorter("grossAmount"),
      },
      {
         title: "Discount Amount",
         dataIndex: "discountAmount",
         key: "discountAmount",
         align: "right",
         ...getColumnSearchProps("discountAmount", "Enter Discount Amount", true),
         sorter: createDiscountAmountSorter("discountAmount"),
      },
      {
         title: "Paid Amount",
         dataIndex: "paidAmount",
         key: "paidAmount",
         align: "right" as const,
         ...getColumnSearchProps("paidAmount", "Enter Paid Amount", true),
         sorter: createGrossAmountSorter("paidAmount"),
      },
      {
         title: "Paid Date",
         dataIndex: "lastPaidDate",
         key: "lastPaidDate",
         ...getColumnSearchProps<CheckPaymentHistoryUI>("lastPaidDate", "Search Paid Date"),
         sorter: createPaidDateSorter("lastPaidDate"),
         
      },
      {
         title: "Bank Status",
         dataIndex: "bankStatus",
         key: "bankStatus",
         sorter: createStatusSafeSorter("bankStatus"),
         filters: [
            { text: "Cleared", value: "Cleared" },
            { text: "Open", value: "Open" },
            { text: "Voided", value: "Voided" },
         ],
         onFilter: (value, record) => record.bankStatus === value,
         render: (bankStatus: string) => {
            const normalizedClass = (bankStatus || "unknown")
               .toLowerCase()
               .replace(/\s+/g, "-"); // e.g., "To Be Cleared" → "to-be-cleared"

            return (
               <span className={`status-pill ${normalizedClass}`}>
                  {bankStatus || "Unknown"}
               </span>
            );
         },
      },
   ];


   function handleSearch(): void {
      // Validate fields and show field-specific errors below inputs
      let hasError = false;
      if (!companyNo) {
         showToasterMessage(
            "error",
            "Company No is required",
            "Please enter a Company No."
         );
         hasError = true;
      }
      if (!vendor) {
         showToasterMessage(
            "error",
            "Vendor No is required",
            "Please enter a Vendor No."
         );
         hasError = true;
      }
      if (hasError) return;

      // Clear stored state when performing a new search and set active session
      clearStoredState();
      sessionStorage.setItem(ACTIVE_SESSION_KEY, "true");

      // Set stable search parameters and trigger React Query refetch
      setApiSearchParams({
         paymentHistory: currentPaymentHistoryParams,
         lastPaymentInfo: currentLastPaymentInfoParams,
      });
      
      setShouldFetch(true);
      // Reset local aggregated data and pagination
      setAllCheckPaymentData([]);
      setCurrentPage(1);
      setHasMoreServerPages(true);
      
      // Use setTimeout to ensure state is updated before refetch
      setTimeout(() => {
         refetchLastPaymentInfo();
         refetchPaymentHistory();
      }, 0);
   }

   function handleReset(): void {
      setCompanyNo("10");
      setVendor(undefined);
      setVendorName("");
      setStartDate(null);
      setInvoiceNo("");
      setCheckNo("");
      // Clear search parameters and disable fetching to reset data
      setApiSearchParams({
         paymentHistory: {},
         lastPaymentInfo: {},
      });
      setShouldFetch(false);
      // Reset local aggregated data and pagination
      setAllCheckPaymentData([]);
      setCurrentPage(1);
      setHasMoreServerPages(true);
      // Clear toaster on reset
      setShowToaster(false);
      setToasterType("error");
      setToasterMessage("");
      setToasterDescription("");
      // Reset vendor component and trigger API call
      if (vendorRef.current) {
         vendorRef.current.resetVendor();
      }
      // Clear stored state and reset URL to default
      clearStoredState();
      const defaultParams = new URLSearchParams();
      defaultParams.set("companyNo", "10");
      setSearchParams(defaultParams);
   }

   // Save current state to URL params only (no caching)
   const saveCurrentState = useCallback(() => {
      // Save to URL params only
      const params = new URLSearchParams();
      if (companyNo) params.set("companyNo", companyNo);
      if (vendor) params.set("vendor", vendor);
      if (startDate) params.set("startDate", startDate);
      if (invoiceNo) params.set("invoiceNo", invoiceNo);
      if (checkNo) params.set("checkNo", checkNo);

      setSearchParams(params);
   }, [companyNo, vendor, startDate, invoiceNo, checkNo, setSearchParams]);

   // Restore state from URL params only (no caching)
   const restoreState = useCallback(() => {
      isRestoringStateRef.current = true;

      // Restore from URL params only
      const companyParam = searchParams.get("companyNo");
      const vendorParam = searchParams.get("vendor");
      const startDateParam = searchParams.get("startDate");
      const invoiceNoParam = searchParams.get("invoiceNo");
      const checkNoParam = searchParams.get("checkNo");

      if (companyParam) setCompanyNo(companyParam);
      if (vendorParam) setVendor(vendorParam);
      if (startDateParam) setStartDate(startDateParam);
      if (invoiceNoParam) setInvoiceNo(invoiceNoParam);
      if (checkNoParam) setCheckNo(checkNoParam);



      setTimeout(() => {
         isRestoringStateRef.current = false;
      }, 100);
   }, [searchParams]);

   // Restore state on component mount
   useEffect(() => {
      const isReturningFromDetail = location.state?.fromCheckInquiry === true;
      const hasStoredState = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const hasActiveSession =
         sessionStorage.getItem(ACTIVE_SESSION_KEY) === "true";

      // Check if this is a fresh page load (refresh or direct access)
      const isPageRefresh = !location.state && !hasActiveSession;

      // If page was refreshed, direct access, or no active session, reset to default
      if (isPageRefresh || (!isReturningFromDetail && !hasActiveSession)) {
         clearStoredState();
         const defaultParams = new URLSearchParams();
         defaultParams.set("companyNo", "10");
         setSearchParams(defaultParams, { replace: true });
         return;
      }

      // Try to restore complete state if:
      // 1. Returning from detail view with state flag, OR
      // 2. There's stored state available AND we have an active session
      if (isReturningFromDetail || (hasStoredState && hasActiveSession)) {
         const restored = restoreCompleteState();
         if (restored) {
            return;
         } else {
         }
      }
      clearStoredState();
      const defaultParams = new URLSearchParams();
      defaultParams.set("companyNo", "10");
      setSearchParams(defaultParams, { replace: true });
   }, [
      location.state?.fromCheckInquiry,
      location.state,
      searchParams,
      restoreCompleteState,
      restoreState,
      clearStoredState,
      SESSION_STORAGE_KEY,
      ACTIVE_SESSION_KEY,
      setSearchParams,
   ]);

   // Monitor route changes and clear data when leaving check-inquiry module
   useEffect(() => {
      const currentPath = location.pathname;
      
      // If user navigated away from check-inquiry module entirely, clear stored data
      if (!currentPath.includes("/check-inquiry")) {
         clearStoredState();
        
      }
   }, [location.pathname, clearStoredState]);

   // Cleanup stored state when component unmounts
   useEffect(() => {
      return () => {
         // Set a flag in sessionStorage to track that component is unmounting
         sessionStorage.setItem("check_inquiry_unmounting", "true");
         
         // Use setTimeout to check the next route after unmounting
         setTimeout(() => {
            const unmountingFlag = sessionStorage.getItem("check_inquiry_unmounting");
            const currentPath = window.location.pathname;
            
            // If we're still flagged as unmounting and current path doesn't include check-inquiry,
            // then we've navigated away from the module entirely
            if (unmountingFlag === "true" && !currentPath.includes("/check-inquiry")) {
               clearStoredState();
               sessionStorage.removeItem("check_inquiry_unmounting");
            } else {
               // We're still in check-inquiry module, keep the flag for potential future checks
               sessionStorage.removeItem("check_inquiry_unmounting");
            }
         }, 100); // Small delay to allow new route to load
      };
   }, [clearStoredState]);

   // Handle page refresh/reload - clear stored state and reset URL
   useEffect(() => {
      const handleBeforeUnload = () => {
         // Clear stored state on page refresh/close
         clearStoredState();
      };

      const handleVisibilityChange = () => {
         if (document.visibilityState === "hidden") {
            // Page is being hidden (user switched tabs, minimized, etc.)
         }
      };

      // Listen for browser navigation events to catch route changes
      const handlePopState = () => {
         const currentPath = window.location.pathname;
         if (!currentPath.includes("/check-inquiry")) {
            clearStoredState();
         
         }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("popstate", handlePopState);

      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
         document.removeEventListener("visibilitychange", handleVisibilityChange);
         window.removeEventListener("popstate", handlePopState);
      };
   }, [clearStoredState]);

   // Remove auto-fetch - search will only happen on button click

   // Save state whenever form data changes (no caching)
   useEffect(() => {
      if (!isRestoringStateRef.current && !isRestoringFromSessionRef.current) {
         saveCurrentState();
      }
   }, [companyNo, vendor, vendorName, startDate, invoiceNo, checkNo, saveCurrentState]);

   // Sync base query data into local aggregation store and save state
   useEffect(() => {
      if (!isRestoringStateRef.current && !isRestoringFromSessionRef.current) {
         // Only save if we have meaningful data (not initial empty states)
         if (
            checkPaymentData.length > 0 ||
            Object.keys(lastPaymentInfo).length > 0
         ) {
            if (checkPaymentData.length > 0) {
               setAllCheckPaymentData(checkPaymentData);
               // Update hasMore based on batch size
               setHasMoreServerPages(checkPaymentData.length === serverItemsPerPage);
            }
            saveCompleteState();
         }
      }
   }, [checkPaymentData, lastPaymentInfo, saveCompleteState]);

   // Pagination change handler with dynamic load-on-demand
   const handlePaginationChange = useCallback(async (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      // Do nothing if no search has been performed
      if (!apiSearchParams.paymentHistory || Object.keys(apiSearchParams.paymentHistory).length === 0) {
         return;
      }

      // Determine if we need to fetch more when crossing 50th page or beyond loaded data
      const totalLoaded = allCheckPaymentData.length;
      const neededCount = page * size;
      // Fetch when user reaches or goes beyond the last loaded page AND server indicates more pages exist
      if (neededCount >= totalLoaded && hasMoreServerPages) {
         // Count already-fetched server pages from local size
         const fetchedServerPages = Math.ceil(totalLoaded / serverItemsPerPage);
         const nextServerPage = fetchedServerPages + 1;

         try {
            const nextParams = {
               ...apiSearchParams.paymentHistory,
               current_page: nextServerPage,
               items_per_page: serverItemsPerPage,
            } as any;
            const nextPageData = await fetchPaymentHistory(nextParams);
            if (Array.isArray(nextPageData) && nextPageData.length > 0) {
               setAllCheckPaymentData((prev) => [...prev, ...nextPageData]);
               // Continue only if we received a full batch size
               setHasMoreServerPages(nextPageData.length === serverItemsPerPage);
            } else {
               // No items returned - no more pages
               setHasMoreServerPages(false);
            }
         } catch (err) {
            console.error("Error fetching additional payment history:", err);
         }
      }
   }, [allCheckPaymentData, apiSearchParams.paymentHistory, fetchPaymentHistory, hasMoreServerPages]);



   return (
      <>
         <h3 className="title">{CHECK_INQUIRY.title}</h3>
         <div className="content-div-container">
            <div className="filter-grids-container">
               <div className="filter-field">
                  <CompanyNo value={companyNo} onChange={setCompanyNo} />
               </div>
                <div className="filter-field">
                   <VendorNumberName
                      ref={vendorRef}
                      value={vendor}
                      onChange={handleVendorChange}
                      companyNo={companyNo}
                   />
                </div>
               <div className="filter-field">
                  <p className="sub-title">Start Date</p>
                  <CustomDatePicker
                     name="startDate"
                     value={startDate || ""}
                     onChange={(_, dateString) =>
                        setStartDate(dateString || null)
                     }
                     className="ui-dropdown-cn"
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Invoice No</p>
                  <CustomPrefixInput
                     name="invoiceNo"
                     placeholder="Enter number"
                     value={invoiceNo}
                     onChange={(e) => setInvoiceNo(e.target.value)}
                     className="ui-dropdown-cn"
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Check No</p>
                  <CustomPrefixInput
                     name="checkNo"
                     placeholder="Enter number"
                     value={checkNo}
                     onChange={(e) => setCheckNo(e.target.value)}
                     className="ui-dropdown-cn"
                  />
               </div>
               <div className="filter-field">
                  <CustomStyledButton
                     name="search"
                     label="Search"
                     onClick={handleSearch}
                  />
               </div>
               <div className="filter-field">
                  <SyncOutlined className="action-icon" onClick={handleReset} />
               </div>
            </div>
         </div>

         <div className="content-div-container">
            <div className="content-card-body">
               <h4>Check Payment History</h4>

               <div className="vendor-details-container">
                  <div className="cards-container">
                      <Card
                         icon={<img src={vendorIcon} alt="Vendor Name" />}
                         label="Vendor Name"
                         value={
                            vendorName || lastPaymentInfo.vendorName || " "
                         }
                      />
                     <div className="single-row">
                        <Card
                           icon={<img src={companyIcon} alt="Company No" />}
                           label="Company No"
                           value={
                              cardDataLoading
                                 ? "Loading..."
                                 : lastPaymentInfo.companyNo?.toString() ||
                                   companyNo ||
                                   " "
                           }
                        />
                        <Card
                           icon={<img src={vendorNoIcon} alt="Vendor No" />}
                           label="Vendor No"
                           value={
                              cardDataLoading
                                 ? "Loading..."
                                 : lastPaymentInfo.vendorNo?.toString() ||
                                   vendor ||
                                   " "
                           }
                        />
                        <Card
                           icon={<img src={openpayables} alt="Open Payables" />}
                           label="Open Payables"
                           value={
                              cardDataLoading
                                 ? "Loading..."
                                 : lastPaymentInfo.openPayables !== undefined
                                 ? formatCurrency(lastPaymentInfo.openPayables)
                                 : " "
                           }
                        />
                        <Card
                           icon={
                              <img
                                 src={paidAmountIcon}
                                 alt="Last Paid Amount"
                              />
                           }
                           label="Last Paid Amount"
                           value={
                              cardDataLoading
                                 ? "Loading..."
                                 : lastPaymentInfo.grossAmount !== undefined
                                 ? formatCurrency(lastPaymentInfo.grossAmount)
                                 : " "
                           }
                        />
                        <Card
                           icon={
                              <img src={calendarIcon} alt="Last Paid Date" />
                           }
                           label="Last Paid Date"
                           value={
                              cardDataLoading
                                 ? "Loading..."
                                 : (() => {
                                      const rawDate =
                                         lastPaymentInfo.lastPaidDate;
                                      if (
                                         !rawDate ||
                                         rawDate === "0" ||
                                         rawDate === ""
                                      ) {
                                         return " ";
                                      }

                                      // Try to format the date
                                      const formatted =
                                         formatMMDDYYForDisplay(rawDate);

                                      // If the formatted result is the same as input (no formatting occurred)
                                      // or if it's " ", it might need special handling
                                      if (
                                         formatted === rawDate ||
                                         formatted === " "
                                      ) {
                                         // Try manual formatting for common cases
                                         const dateStr = rawDate.toString();
                                         if (
                                            dateStr.length === 6 &&
                                            !isNaN(Number(dateStr))
                                         ) {
                                            const mm = dateStr.substring(0, 2);
                                            const dd = dateStr.substring(2, 4);
                                            const yy = dateStr.substring(4, 6);
                                            return `${mm}/${dd}/${yy}`;
                                         }
                                      }

                                      return formatted;
                                   })()
                           }
                        />
                     </div>
                  </div>
               </div>

               <div className="table-responsive-container">
               <TableWidget<CheckPaymentHistoryUI>
                  columns={columns}
                  dataSource={allCheckPaymentData.length > 0 ? allCheckPaymentData : checkPaymentData}
                  loading={loading}
                  rowKey="key"
                  pagination={{
                     current: currentPage,
                     pageSize: pageSize,
                     total: (allCheckPaymentData.length > 0 ? allCheckPaymentData.length : checkPaymentData.length),
                     showSizeChanger: true,
                     showQuickJumper: true,
                     onChange: handlePaginationChange,
                  }}
               />
               </div>
            </div>
         </div>
         {showToaster && (
            <Toaster
               type={toasterType}
               title={toasterMessage}
               subtitle={toasterDescription}
               onClose={closeToaster}
            />
         )}
      </>
   );
};

export default CheckEnquiry;
