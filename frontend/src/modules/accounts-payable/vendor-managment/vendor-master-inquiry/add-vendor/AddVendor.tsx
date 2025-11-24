import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch } from "antd";
import Toaster from "@widget-library/Toaster";
import Card from "@widget-library/Card";
import { scrollToError } from "@utils/scrollToError";
import companyIcon from "@assets/icons/company-icon.svg";
import popupOk from "@assets/icons/popup-ok.svg";
import { DefaultButton, CustomStyledButton } from "@widget-library/Buttons";
import ModalContent from "@widget-library/Modal";
import { modalActions, iconAltTexts } from "@constants/commonConstants";
import { useVendorManagement } from "@hooks/useVendorManagement";
import type {
   VendorDetailsDto,
   VendorContactDetailDto,
} from "@api/api-schema/api";
import type { VendorData } from "@/types/accounts-payable.types";
import { fetchNextVendorNo } from "@api/api-hooks";
import "../vendor-master.scss";
import "./vendor-forms/vendor-forms.scss";
import VendorDetailsForm from "./vendor-forms/VendorDetailsForm";
import ExpenseDetailsForm from "./vendor-forms/ExpenseDetailsForm";
import BankDetailsSection from "./vendor-forms/BankDetailsSection";
import Section1099Form from "./vendor-forms/Section1099";
import MonthToDateSection from "./vendor-forms/MonthToDateSection";
import YearToDateSection from "./vendor-forms/YearToDateSection";
import VendorFormContacts from "./vendor-forms/VendorContactSection";

interface AddVendorProps {
   mode?: "add" | "edit";
   vendorData?: VendorData | null;
   onSaveSuccess?: () => void;
   onCancel?: () => void;
   onSave?: (vendorData: any, contactDetails: any[]) => Promise<void>;
   hideContacts?: boolean;
   context?: "ap-period-end" | "vendor-management";
}

const AddVendor: React.FC<AddVendorProps> = ({
   mode: propMode,
   vendorData: propVendorData,
   onSaveSuccess,
   onCancel,
   onSave,
   hideContacts = false,
   context = "vendor-management",
}) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { createOrUpdateVendor } = useVendorManagement();

   // Determine mode from prop first, then URL (prioritize prop-based mode)
   const isEditMode =
      propMode === "edit" ||
      (propMode === undefined && location.pathname.includes("/edit-vendor"));
   const mode = isEditMode ? "edit" : "add";

   // Get vendor data from prop or navigation state (for edit mode)
   const vendorData =
      propVendorData || (location.state?.vendorData as VendorData | undefined);

   const [companyNo] = useState("10");
   const [companyName] = useState("A.R.G. BRADFORD DIVISI");
   const [isActive, setIsActive] = useState(true); // For Active toggle in edit mode
   const [formData, setFormData] = useState({
      // Vendor Details (mandatory fields)
      vendorNo: undefined as unknown as number,
      vendorName: "",
      vendorAdd1: "",
      vendorAdd2: "",
      vendorAdd3: "",
      vendorAdd4: "",
      vendorCountryCode: "US",
      vendorZipCode: 0,
      vendorAreaCode: 0,
      vendorTelephoneNo: 0,
      vendorNameOverflow: false,

      // Optional vendor fields
      vendorHoldPaymentsVend: "",
      vendorGalRcptsRequired: "",
      vendorSingleCheck: "",
      vendorApTermsCode: 0,
      vendorApTermsCodeDescription: "",
      vendorAdpPayrollId: 0,
      vendorCategoryCode: "",
      vendorCategoryCodeDescription: "",
      vendorCarrierId: "",
      vendorExpenseGLSub: 0,

      // Bank details (optional)
      vendorAchBankAccountNumber: "",
      vendorAchBankRoutingCode: 0,
      vendorAchCheckingOrSavings: "",
      vendorAchClass: "",

      // 1099 details (optional)
      vendorFirstName: "",
      vendorMiddleName: "",
      vendorBusinessLastName: "",
      vendorNameSuffix: "",
      vendorAp1099Code: "",
      vendorAp1099CodeDescription: "",
      vendorFirst1099BoxNumber: 0,
      vendorSecond1099BoxNumber: 0,
      vendorSecond1099BoxAmount: 0,
      vendorPayeeName1: "",
      vendorPayeeName2: "",
      vendorIdNumber: "",
      vendorIrsNameControl: "",

      // Month-to-Date values
      vendorCurrentBalance: 0,
      vendorMtdPurchases: 0,
      vendorMtdPayments: 0,
      vendorMtdDiscounts: 0,
      vendorPreviousBalance: 0,

      // Year-to-Date values
      vendorYtdPurchases: 0,
      vendorThisYrYtdPaid: 0,
      vendorYtdDiscounts: 0,
      vendorLastYearPurchases: 0,
      vendorLastYrYtdPaid: 0,
      vendorLastPaymentAmt: 0,
      vendorLastPaymentDate: 0,
   });
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
   const [loading, setLoading] = useState(false);
   const [vendorNoLoading, setVendorNoLoading] = useState(false);
   const [toasterType, setToasterType] = useState<"success" | "error">(
      "success"
   );
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");

   // Populate form data when in edit mode
   useEffect(() => {
      if (mode === "edit" && vendorData?.vendorDetails?.vendor) {
         const vendor = vendorData.vendorDetails.vendor;
         setFormData(
            (prev) =>
               ({
                  ...prev,
                  vendorNo: vendor.vendorNo || prev.vendorNo,
                  vendorName: vendor.vendorName?.trim() || prev.vendorName,
                  vendorAdd1: vendor.vendorAdd1?.trim() || prev.vendorAdd1,
                  vendorAdd2: vendor.vendorAdd2?.trim() || prev.vendorAdd2,
                  vendorAdd3: vendor.vendorAdd3?.trim() || prev.vendorAdd3,
                  vendorAdd4: vendor.vendorAdd4?.trim() || prev.vendorAdd4,
                  vendorCountryCode:
                     vendor.vendorCountryCode?.trim() || prev.vendorCountryCode,
                  vendorZipCode: vendor.vendorZipCode || prev.vendorZipCode,
                  vendorAreaCode: vendor.vendorAreaCode || prev.vendorAreaCode,
                  vendorTelephoneNo: (() => {
                     const areaStr = vendor.vendorAreaCode ? String(vendor.vendorAreaCode) : "";
                     const phoneStr = vendor.vendorTelephoneNo ? String(vendor.vendorTelephoneNo) : "";
                     const combined = `${areaStr}${phoneStr}`;
                     return combined ? parseInt(combined, 10) : prev.vendorTelephoneNo;
                  })(),
                  vendorNameOverflow: vendor.vendorNameOverflow === "Y",

                  // Optional vendor fields
                  vendorHoldPaymentsVend:
                     vendor.vendorHoldPaymentsVend?.trim() ||
                     prev.vendorHoldPaymentsVend,
                  vendorGalRcptsRequired:
                     vendor.vendorGalRcptsRequired?.trim() ||
                     prev.vendorGalRcptsRequired,
                  vendorSingleCheck:
                     vendor.vendorSingleCheck?.trim() || prev.vendorSingleCheck,
                  vendorApTermsCode:
                     vendor.vendorApTermsCode || prev.vendorApTermsCode,
                  vendorAdpPayrollId:
                     vendor.vendorAdpPayrollId || prev.vendorAdpPayrollId,
                  vendorCategoryCode:
                     vendor.vendorCategoryCode?.trim() ||
                     prev.vendorCategoryCode,
                  vendorCarrierId:
                     vendor.vendorCarrierId?.trim() || prev.vendorCarrierId,
                  vendorExpenseGLSub:
                     vendor.vendorExpenseGLSub || prev.vendorExpenseGLSub,

                  // Bank details
                  vendorAchBankAccountNumber:
                     vendor.vendorAchBankAccountNumber?.trim() ||
                     prev.vendorAchBankAccountNumber,
                  vendorAchBankRoutingCode:
                     vendor.vendorAchBankRoutingCode ||
                     prev.vendorAchBankRoutingCode,
                  vendorAchCheckingOrSavings:
                     vendor.vendorAchCheckingOrSavings?.trim() ||
                     prev.vendorAchCheckingOrSavings,
                  vendorAchClass:
                     vendor.vendorAchClass?.trim() || prev.vendorAchClass,

                  // 1099 details
                  vendorFirstName:
                     vendor.vendorFirstName?.trim() || prev.vendorFirstName,
                  vendorMiddleName:
                     vendor.vendorMiddleName?.trim() || prev.vendorMiddleName,
                  vendorBusinessLastName:
                     vendor.vendorBusinessLastName?.trim() ||
                     prev.vendorBusinessLastName,
                  vendorNameSuffix:
                     vendor.vendorNameSuffix?.trim() || prev.vendorNameSuffix,
                  vendorAp1099Code:
                     vendor.vendorAp1099Code?.trim() || prev.vendorAp1099Code,
                  vendorAp1099CodeDescription:
                     (vendor as any).vendorAp1099CodeDescription?.trim() ||
                     prev.vendorAp1099CodeDescription,
                  vendorFirst1099BoxNumber:
                     vendor.vendorFirst1099BoxNumber ||
                     prev.vendorFirst1099BoxNumber,
                  vendorSecond1099BoxNumber:
                     vendor.vendorSecond1099BoxNumber ||
                     prev.vendorSecond1099BoxNumber,
                  vendorSecond1099BoxAmount:
                     vendor.vendorSecond1099BoxAmount ||
                     prev.vendorSecond1099BoxAmount,
                  vendorPayeeName1:
                     vendor.vendorPayeeName1?.trim() || prev.vendorPayeeName1,
                  vendorPayeeName2:
                     vendor.vendorPayeeName2?.trim() || prev.vendorPayeeName2,
                  vendorIdNumber:
                     vendor.vendorIdNumber?.trim() || prev.vendorIdNumber,
                  vendorIrsNameControl:
                     vendor.vendorIrsNameControl?.trim() ||
                     prev.vendorIrsNameControl,

                  // Month-to-Date values
                  vendorCurrentBalance:
                     vendor.vendorCurrentBalance || prev.vendorCurrentBalance,
                  vendorMtdPurchases:
                     vendor.vendorMtdPurchases || prev.vendorMtdPurchases,
                  vendorMtdPayments:
                     vendor.vendorMtdPayments || prev.vendorMtdPayments,
                  vendorMtdDiscounts:
                     vendor.vendorMtdDiscounts || prev.vendorMtdDiscounts,
                  vendorPreviousBalance:
                     vendor.vendorPreviousBalance || prev.vendorPreviousBalance,

                  // Year-to-Date values
                  vendorYtdPurchases:
                     vendor.vendorYtdPurchases || prev.vendorYtdPurchases,
                  vendorThisYrYtdPaid:
                     vendor.vendorThisYrYtdPaid || prev.vendorThisYrYtdPaid,
                  vendorYtdDiscounts:
                     vendor.vendorYtdDiscounts || prev.vendorYtdDiscounts,
                  vendorLastYearPurchases:
                     vendor.vendorLastYearPurchases ||
                     prev.vendorLastYearPurchases,
                  vendorLastYrYtdPaid:
                     vendor.vendorLastYrYtdPaid || prev.vendorLastYrYtdPaid,
                  vendorLastPaymentAmt:
                     vendor.vendorLastPaymentAmt || prev.vendorLastPaymentAmt,
                  vendorLastPaymentDate:
                     vendor.vendorLastPaymentDate || prev.vendorLastPaymentDate,
               } as any)
         );

         // Set active toggle based on vendor status
         setIsActive(vendor.vendorIsDeleted === "A");

         // Set contacts if available
         if (vendorData.vendorDetails.vendorContactDetails?.length > 0) {
                  setContacts(
                     vendorData.vendorDetails.vendorContactDetails.map(
                        (contact, index) => ({
                           id: index + 1,
                           data: {
                              name: contact.contactName?.trim() || "",
                              type: contact.formType?.trim() || "",
                              email: contact.emailAddress?.trim() || "",
                              includeAch: contact.sendAchEmail === "Y",
                              formTypeCode: contact.formType?.trim() || "",
                              formTypeDescription: contact.formTypeDescription || "",
                              comments: contact.filler?.trim() || contact.comments || "",
                              sequenceNumber: contact.sequenceNumber, // Store original sequence number for edit mode
                              isDeleted: false, // Existing contacts from API are not deleted initially
                           },
                        })
                     )
                  );
         }
      }
   }, [mode, vendorData]);

   // Fetch next vendor number when in add mode
   useEffect(() => {
      if (mode === "add") {
         const getNextVendorNo = async () => {
            setVendorNoLoading(true);
            try {
               const nextVendorNo = await fetchNextVendorNo(
                  parseInt(companyNo)
               );
               if (nextVendorNo) {
                  setFormData((prev) => ({
                     ...prev,
                     vendorNo: nextVendorNo,
                  }));
               }
            } catch (error) {
               console.error("Error fetching next vendor number:", error);
            } finally {
               setVendorNoLoading(false);
            }
         };

         getNextVendorNo();
      }
   }, [mode, companyNo]);

   const refreshVendorNo = async () => {
      setVendorNoLoading(true);
      try {
         const nextVendorNo = await fetchNextVendorNo(parseInt(companyNo));
         if (nextVendorNo) {
            setFormData((prev) => ({
               ...prev,
               vendorNo: nextVendorNo,
            }));
         }
      } catch (error) {
         console.error("Error refreshing vendor number:", error);
      } finally {
         setVendorNoLoading(false);
      }
   };

   const handleChange = (field: string, value: string | number | boolean) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
      
      // Clear field error when value changes (especially for telephone field)
      // This ensures errors from previous validation attempts are cleared
      if (fieldErrors[field]) {
         setFieldErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
         });
      }
   };

   const values = {
      thisYearPurchases: formData.vendorYtdPurchases || 0,
      thisYearPayments: formData.vendorThisYrYtdPaid || 0,
      thisYearDiscounts: formData.vendorYtdDiscounts || 0,
      lastPaymentDate: String(formData.vendorLastPaymentDate || "-"),
      lastYearPurchases: formData.vendorLastYearPurchases || 0,
      lastYearPayments: formData.vendorLastYrYtdPaid || 0,
      lastPaymentAmount: formData.vendorLastPaymentAmt || 0,
   };

   const [contacts, setContacts] = useState([
      {
         id: 1,
         data: {
            name: "",
            type: "",
            email: "",
            includeAch: false,
            formTypeCode: "",
            formTypeDescription: "",
            comments: "",
            sequenceNumber: undefined as number | undefined, // Only set for edit mode
            isDeleted: false, // Track if contact is marked for deletion
         },
      },
   ]);

   const handleAddContact = () => {
      const newId = contacts.length
         ? Math.max(...contacts.map((c) => c.id)) + 1
         : 1;
      setContacts([
         ...contacts,
         {
            id: newId,
            data: {
               name: "",
               type: "",
               email: "",
               includeAch: false,
               formTypeCode: "",
               formTypeDescription: "",
               comments: "",
               sequenceNumber: undefined as number | undefined, // New contacts don't have sequence number
               isDeleted: false, // New contacts are not deleted
            },
         },
      ]);
   };

   const handleDeleteContact = (id: number) => {
      setContacts(
         contacts.map((contact) =>
            contact.id === id
               ? { ...contact, data: { ...contact.data, isDeleted: true } }
               : contact
         )
      );
   };

   const handleContactChange = (
      id: number,
      field: string,
      value: string | boolean
   ) => {
      setContacts((prev) =>
         prev.map((contact) =>
            contact.id === id
               ? {
                    ...contact,
                    data: {
                       ...contact.data,
                       [field]: value,
                    },
                 }
               : contact
         )
      );
   };

   const handleSave = async () => {
      // Client-side validation for required fields
      const nextErrors: Record<string, string> = {};
      if (!formData.vendorNo || Number(formData.vendorNo) <= 0) {
         nextErrors.vendorNo = "Vendor No is required";
      }
      if (!formData.vendorName || !String(formData.vendorName).trim()) {
         nextErrors.vendorName = "Vendor Name is required";
      }
      if (
         !formData.vendorCountryCode ||
         !String(formData.vendorCountryCode).trim()
      ) {
         nextErrors.vendorCountryCode = "Country is required";
      }
      if (!formData.vendorZipCode || Number(formData.vendorZipCode) <= 0) {
         nextErrors.vendorZipCode = "Zipcode is required";
      }
      // Phone number: enforce exactly 10 digits when provided
      {
         const phoneValue = formData.vendorTelephoneNo;
         const phoneDigits = (phoneValue?.toString() || "").replace(/\D/g, "");
         // Only validate if there's actually a value (not 0 or empty)
         if (phoneValue && phoneValue !== 0 && phoneDigits !== "0" && phoneDigits.length !== 10) {
            nextErrors.vendorTelephoneNo = "Phone number must be exactly 10 digits";
         }
      }

      if (Object.keys(nextErrors).length > 0) {
         setFieldErrors(nextErrors);
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Please fix the required fields");
         // Scroll to the first field with error
         const firstErrorField = Object.keys(nextErrors)[0];
         scrollToError(firstErrorField);
         return;
      }

      try {
         setLoading(true);
         setFieldErrors({});

         // Prepare the contact details for API
         const isEditMode = mode === "edit" && formData.vendorNo;
         const contactDetails: VendorContactDetailDto[] = contacts
            .filter(
               (contact) =>
                  // Include contacts that have any user-entered data OR are marked for deletion
                  contact.data.name ||
                  contact.data.email ||
                  contact.data.comments ||
                  contact.data.isDeleted
            )
            .map((contact) => {
               const baseContact = {
                  formType: contact.data.formTypeCode,
                  contactName: contact.data.name,
                  emailAddress: contact.data.email,
                  sendAchEmail: contact.data.includeAch ? "Y" : "N",
                  filler: contact.data.comments || "",
                  deleteCode: contact.data.isDeleted ? "I" : "", // Add deleteCode based on isDeleted flag
               };

               // For edit mode: only use original sequenceNumber if available from GET API, don't generate new ones
               // For add mode: don't include sequenceNumber at all
               if (isEditMode) {
                  // Only include sequenceNumber if it was received from the GET API
                  if (contact.data.sequenceNumber !== undefined) {
                     return {
                        ...baseContact,
                        sequenceNumber: contact.data.sequenceNumber,
                     };
                  } else {
                     // Don't include sequenceNumber for new contacts in edit mode
                     return baseContact;
                  }
               } else {
                  return baseContact; // No sequenceNumber for add mode
               }
            });

        // Split phone number: first up to 3 digits as area code, rest as phone number
        const phoneStr = formData.vendorTelephoneNo?.toString() || "";
        const cleanedPhone = phoneStr.replace(/\D/g, ''); // Remove any formatting
        
        let areaCode = 0;
        let phoneNumber = 0;
        
        if (cleanedPhone.length > 0) {
           const areaPart = cleanedPhone.slice(0, Math.min(3, cleanedPhone.length));
           const phonePart = cleanedPhone.slice(3);
           areaCode = areaPart ? parseInt(areaPart, 10) : 0;
           phoneNumber = phonePart ? parseInt(phonePart, 10) : 0;
        }

        // Prepare the vendor data payload
        const vendorData: VendorDetailsDto & { vendorIsDeleted: string; vendorAreaCode?: number; IdNo1099?: string; contactDetails?: VendorContactDetailDto[] } = {
            vendorCompanyNumber: parseInt(companyNo),
            vendorNo: formData.vendorNo,
            vendorName: formData.vendorName || "",
            vendorAdd1: formData.vendorAdd1 || "",
            vendorAdd2: formData.vendorAdd2 || "",
            vendorAdd3: formData.vendorAdd3 || "",
            vendorAdd4: formData.vendorAdd4 || "",
            vendorCountryCode: formData.vendorCountryCode || "",
            vendorZipCode: formData.vendorZipCode,
            vendorAreaCode: areaCode,
            vendorTelephoneNo: phoneNumber,
            vendorIsDeleted: (isActive ? "A" : "I") as never, // Map toggle state to vendorIsDeleted

            vendorHoldPaymentsVend: formData.vendorHoldPaymentsVend || "",
            vendorGalRcptsRequired: formData.vendorGalRcptsRequired || "",
            vendorSingleCheck: formData.vendorSingleCheck || "",
            vendorApTermsCode: formData.vendorApTermsCode || 0,
            vendorAdpPayrollId: formData.vendorAdpPayrollId || 0,
            vendorCategoryCode: formData.vendorCategoryCode || "",
            vendorCarrierId: formData.vendorCarrierId || "",
            vendorExpenseGLSub: formData.vendorExpenseGLSub || 0,

            vendorAchBankAccountNumber: formData.vendorAchBankAccountNumber || "",
            vendorAchBankRoutingCode: formData.vendorAchBankRoutingCode || 0,
            vendorAchCheckingOrSavings: formData.vendorAchCheckingOrSavings || "",
            vendorAchClass: formData.vendorAchClass || "",

            vendorFirstName: formData.vendorFirstName || "",
            vendorMiddleName: formData.vendorMiddleName || "",
            vendorBusinessLastName: formData.vendorBusinessLastName || "",
            vendorNameSuffix: formData.vendorNameSuffix || "",
            vendorAp1099Code: formData.vendorAp1099Code || "",
            vendorFirst1099BoxNumber: formData.vendorFirst1099BoxNumber || 0,
            vendorSecond1099BoxNumber: formData.vendorSecond1099BoxNumber || 0,
            vendorSecond1099BoxAmount: formData.vendorSecond1099BoxAmount || 0,
            vendorPayeeName1: formData.vendorPayeeName1 || "",
            vendorPayeeName2: formData.vendorPayeeName2 || "",
            // Note: vendorIdNumber is not part of VendorDetailsDto, using vendorIrsNameControl for now
            vendorIrsNameControl: formData.vendorIrsNameControl || "",
          // Include 1099 ID (TIN) as IdNo1099 in payload
          IdNo1099: formData.vendorIdNumber || "",

            // Contact details
            contactDetails:
               contactDetails.length > 0 ? contactDetails : undefined,
         };


         // Use custom save handler if provided, otherwise use default API
         if (onSave) {
            await onSave(vendorData, contactDetails);
         } else {
            // Default API call using useApi hook
            // Prepare the complete vendor data for the request body only
            const vendorPayload = {
               ...vendorData, // This already includes the split vendorAreaCode and vendorTelephoneNo
               vendorCompanyNumber: parseInt(companyNo),
               vendorNo: formData.vendorNo,
               vendorName: formData.vendorName || "",
               vendorAdd1: formData.vendorAdd1 || "",
               vendorAdd2: formData.vendorAdd2 || "",
               vendorAdd3: formData.vendorAdd3 || "",
               vendorAdd4: formData.vendorAdd4 || "",
               vendorCountryCode: formData.vendorCountryCode || "",
               vendorZipCode: formData.vendorZipCode,
               // vendorAreaCode and vendorTelephoneNo are already included from vendorData spread
               vendorIsDeleted: isActive ? "A" : "I", // Map toggle state to vendorIsDeleted
            };

            const response = await createOrUpdateVendor(vendorPayload);

            const respAny = response as any;
            const successErrorObj = respAny?.data?.error || respAny?.error;
            if (successErrorObj) {
               console.warn(
                  "API returned error object in success path:",
                  successErrorObj
               );
               const details:
                  | Array<{ field?: string; message?: string }>
                  | undefined =
                  successErrorObj?.details ||
                  respAny?.data?.details ||
                  respAny?.data?.errors;
               if (Array.isArray(details)) {
                  const fieldNameMapping: Record<string, string> = {
                     "Carrier Id": "vendorCarrierId", 
                  };
                  
                  const next: Record<string, string> = {};
                  for (const d of details) {
                     if (!d?.field) continue;
                     const frontendFieldName = fieldNameMapping[d.field] || d.field;
                     next[frontendFieldName] = d?.message || "Invalid value";
                  }
                  setFieldErrors(next);
                  // Scroll to the first field with error from API validation
                  const firstErrorField = Object.keys(next)[0];
                  if (firstErrorField) {
                     scrollToError(firstErrorField);
                  }
               }
               setToasterType("error");
               setToasterMessage("Error");
               setToasterDescription(
                  successErrorObj?.message || "Failed to save vendor"
               );
               return;
            }
         }

         // Success handling for both custom and default save
         if (onSaveSuccess) {
            onSaveSuccess();
         } else {
            setIsModalVisible(true);
         }
      } catch (error: any) {
         console.error("Vendor create/update failed:", error);
         let apiError =
            error?.error?.error ||
            error?.error ||
            error?.response?.data?.error ||
            error?.data?.error ||
            error;

         // Handle native Response objects
         if (error instanceof Response) {
            try {
               const responseText = await error.text();

               if (responseText) {
                  const parsedError = JSON.parse(responseText);

                  apiError = parsedError.error || parsedError;
               }
            } catch (parseError) {}
         }

         let generalMessage: string | null = null;
         let errorTitle = "Error";

         // Handle field-specific errors from details array first
         const details:
            | Array<{ field?: string; message?: string }>
            | undefined = apiError?.details || [];
         const fieldSpecificErrors: Record<string, string> = {};
         let hasFieldSpecificErrors = false;
         let generalServerError = null;

         const fieldNameMapping: Record<string, string> = {
            "Carrier Id": "vendorCarrierId", // API returns "Carrier Id" for Carrier Id field
         };

         if (Array.isArray(details)) {
            for (const d of details) {
               if (d?.field && d?.field.trim() !== "") {
                  // Field-specific error - map to form field
                  const frontendFieldName = fieldNameMapping[d.field] || d.field;
                  fieldSpecificErrors[frontendFieldName] = d?.message || "Invalid value";
                  hasFieldSpecificErrors = true;
               } else if (d?.message) {
                  // General error without specific field
                  generalServerError = d.message;
               }
            }

            if (hasFieldSpecificErrors) {
               setFieldErrors(fieldSpecificErrors);

               // Scroll to the first field with error
               const firstErrorField = Object.keys(fieldSpecificErrors)[0];
               if (firstErrorField) {
                  
                  scrollToError(firstErrorField);
               }
            }
         }

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "SERVER_ERROR") {
               errorTitle = "Server Error";

               // Only show general toaster if there are no field-specific errors
               // OR if there's a general server error message
               if (!hasFieldSpecificErrors || generalServerError) {
                  if (generalServerError) {
                     generalMessage = generalServerError;
                  } else if (
                     apiError?.details &&
                     Array.isArray(apiError.details)
                  ) {
                     const serverError = apiError.details[0];
                     if (serverError && serverError.message) {
                        generalMessage = serverError.message;
                     } else {
                        generalMessage =
                           apiError.message ||
                           "A server error occurred while saving vendor.";
                     }
                  } else {
                     generalMessage =
                        apiError.message ||
                        "A server error occurred while saving vendor.";
                  }
               } else {
                  // If we have field-specific errors, don't show general toaster
                  generalMessage = null;
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorTitle = "Validation Error";

               // Only show general toaster if there are no field-specific errors
               if (!hasFieldSpecificErrors) {
                  generalMessage = apiError.message || "Invalid data provided.";
               } else {
                  generalMessage = null;
               }
            } else if (apiError?.message) {
               generalMessage = apiError.message;
            }
         } else {
            // No structured API error, use fallback message

            generalMessage = "Failed to save vendor";
         }

         // Only show toaster if there's a general message to display
         if (generalMessage) {
            setToasterType("error");
            setToasterMessage(errorTitle);
            setToasterDescription(generalMessage);
         } else if (hasFieldSpecificErrors) {
         } else {
            // Fallback if no specific errors were found
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription("Failed to save vendor");
         }
      } finally {
         setLoading(false);
      }
   };

   const handleModalClose = () => {
      setIsModalVisible(false);
      if (onSaveSuccess) {
         onSaveSuccess();
      } else {
         navigate("/accounts-payable/vendor-management/vendor-maintenance", {
            state: {
               successMessage:
                  mode === "edit"
                     ? "Vendor updated successfully"
                     : "Vendor added successfully",
            },
         });
      }
   };

   return (
      <>
         {toasterMessage && (
            <Toaster
               type={toasterType}
               title={toasterMessage}
               subtitle={toasterDescription}
               onClose={() => {
                  setToasterMessage("");
                  setToasterDescription("");
               }}
            />
         )}
         <div className="voucherentry-container">
            <h3 className="title">
               {mode === "edit" ? "Edit Vendor" : "Add Vendor"}
            </h3>
            <div className="content-div-container add-vendor-main-container">
               <div className="cards-row">
                  <div className="card-left">
                     <Card
                        icon={
                           <img
                              src={companyIcon}
                              alt={iconAltTexts.companyIcon}
                           />
                        }
                        label="Company No"
                        value={companyNo}
                     />
                  </div>
                  <div className="card-right">
                     <Card
                        icon={
                           <img
                              src={companyIcon}
                              alt={iconAltTexts.companyIcon}
                           />
                        }
                        label="Company Name"
                        value={companyName}
                     />
                  </div>

                  {mode === "edit" && (
                     <div className="active-toggle flex-col">
                        <span className="sub-title">Active</span>
                        <Switch checked={isActive} onChange={setIsActive} />
                     </div>
                  )}
               </div>

               <VendorDetailsForm
                  formData={formData}
                  onChange={handleChange}
                  onRefreshVendorNo={
                     mode === "add" ? refreshVendorNo : undefined
                  }
                  vendorNoLoading={vendorNoLoading}
                  isAddMode={mode === "add"}
                  errors={fieldErrors}
               />
               <ExpenseDetailsForm
                  formData={formData}
                  onChange={handleChange}
                  isEditMode={mode === "edit"}
                  errors={fieldErrors}
               />
               <BankDetailsSection
                  values={{
                     achBankAccount:
                        formData.vendorAchBankAccountNumber?.toString() || "",
                     achBankRouting:
                        formData.vendorAchBankRoutingCode?.toString() || "",
                     achCheckingOrSavings:
                        formData.vendorAchCheckingOrSavings || "",
                     bankClass: formData.vendorAchClass || "",
                  }}
                  onChange={(field, value) => {
                     const mappings: Record<string, string> = {
                        achBankAccount: "vendorAchBankAccountNumber",
                        achBankRouting: "vendorAchBankRoutingCode",
                        achCheckingOrSavings: "vendorAchCheckingOrSavings",
                        bankClass: "vendorAchClass",
                     };
                     const formField = mappings[field];
                     if (formField) {
                        handleChange(formField, value);
                     }
                  }}
                  errors={fieldErrors}
               />

               <Section1099Form
                  values={{
                     firstName: formData.vendorFirstName || "",
                     middleName: formData.vendorMiddleName || "",
                     lastName: formData.vendorBusinessLastName || "",
                     suffix: formData.vendorNameSuffix || "",
                     code1099: formData.vendorAp1099Code || "",
                     desc1099: formData.vendorAp1099CodeDescription || "",
                     id1099: formData.vendorIdNumber || "",
                     irsNameControl: formData.vendorIrsNameControl || "",
                     box1_1099:
                        formData.vendorFirst1099BoxNumber?.toString() || "",
                     box2_1099:
                        formData.vendorSecond1099BoxNumber?.toString() || "",
                     boxAmt2_1099:
                        formData.vendorSecond1099BoxAmount?.toString() || "",
                     payee1: formData.vendorPayeeName1 || "",
                     payee2: formData.vendorPayeeName2 || "",
                  }}
                  onChange={(field, value) => {
                     const mappings: Record<string, string> = {
                        firstName: "vendorFirstName",
                        middleName: "vendorMiddleName",
                        lastName: "vendorBusinessLastName",
                        suffix: "vendorNameSuffix",
                        code1099: "vendorAp1099Code",
                        desc1099: "vendorAp1099CodeDescription",
                        id1099: "vendorIdNumber",
                        irsNameControl: "vendorIrsNameControl",
                        box1_1099: "vendorFirst1099BoxNumber",
                        box2_1099: "vendorSecond1099BoxNumber",
                        boxAmt2_1099: "vendorSecond1099BoxAmount",
                        payee1: "vendorPayeeName1",
                        payee2: "vendorPayeeName2",
                     };
                     const formField = mappings[field];
                     if (formField) {
                        handleChange(formField, value);
                     }
                  }}
                  errors={fieldErrors}
               />

               <MonthToDateSection
                  values={[
                     {
                        label: "Current Balance",
                        amount: (formData.vendorCurrentBalance || 0).toFixed(2),
                     },
                     {
                        label: "Purchases",
                        amount: (formData.vendorMtdPurchases || 0).toFixed(2),
                     },
                     {
                        label: "Payments",
                        amount: (formData.vendorMtdPayments || 0).toFixed(2),
                     },
                     {
                        label: "Discounts",
                        amount: (formData.vendorMtdDiscounts || 0).toFixed(2),
                     },
                     {
                        label: "Previous Bal",
                        amount: (formData.vendorPreviousBalance || 0).toFixed(
                           2
                        ),
                     },
                  ]}
               />

               <YearToDateSection 
                  values={values} 
                  onChange={(field, value) => {
                     const fieldMapping = {
                        thisYearPayments: 'vendorThisYrYtdPaid',
                        thisYearPurchases: 'vendorYtdPurchases',
                        thisYearDiscounts: 'vendorYtdDiscounts',
                        lastPaymentDate: 'vendorLastPaymentDate',
                        lastYearPurchases: 'vendorLastYearPurchases',
                        lastYearPayments: 'vendorLastYrYtdPaid',
                        lastPaymentAmount: 'vendorLastPaymentAmt',
                     };
                     const formField = fieldMapping[field as keyof typeof fieldMapping];
                     if (formField) {
                        handleChange(formField, value);
                     }
                  }}
                  editableFields={context === "ap-period-end" ? ['thisYearPayments'] : []}
                  errors={fieldErrors}
                  context={context}
               />

               {!hideContacts && (
                  <VendorFormContacts
                     contacts={contacts}
                     onAdd={handleAddContact}
                     onDelete={handleDeleteContact}
                     onChange={handleContactChange}
                     errors={fieldErrors}
                  />
               )}

               {/* Action Buttons */}
               <div className="add-vendor-actions-row">
                  <DefaultButton
                     name="cancel"
                     label="Cancel"
                     onClick={() => {
                        if (onCancel) {
                           onCancel();
                        } else {
                           navigate(
                              "/accounts-payable/vendor-management/vendor-maintenance"
                           );
                        }
                     }}
                     className="ant-Button"
                  />
                  <CustomStyledButton
                     name="submitForm"
                     label={loading ? "Saving..." : "Save"}
                     onClick={handleSave}
                     disabled={loading}
                  />
               </div>
            </div>

            <ModalContent
               title={mode === "edit" ? "Vendor Updated" : "Vendor Added"}
               description={
                  mode === "edit"
                     ? "Vendor has been updated successfully."
                     : "Vendor has been added successfully."
               }
               visible={isModalVisible}
               onCancel={handleModalClose}
               showCloseIcon={false}
               imageUrl={popupOk}
               actions={[
                  {
                     name: modalActions[0].name,
                     label: modalActions[0].label,
                     onClick: handleModalClose,
                  },
               ]}
               className="cne-modal descripition" // Match CreateNewEntry className
            />
         </div>
      </>
   );
};

export default AddVendor;
