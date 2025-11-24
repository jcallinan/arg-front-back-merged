import React, {
   useState,
   useEffect,
   useRef,
   useCallback,
   forwardRef,
   useImperativeHandle,
} from "react";
import { debounce } from "lodash";
import { CustomSearchableSelect } from "@widget-library/Dropdown";
import type { VendorNumberNameProps } from "@type-definitions/accounts-payable.types";
import type { Vendor } from "@modules/accounts-payable/voucher-management/types-api/voucher-management-types";
import { useVendors } from "@hooks/useVendors";
import { vendorNoName } from "@constants/commonConstants";

export interface VendorNumberNameRef {
   resetVendor: () => void;
   getVendorName: (vendorId: string) => string | undefined;
}

const VendorNumberName = forwardRef<VendorNumberNameRef, VendorNumberNameProps>(
   ({ value, onChange, companyNo, disabled = false }, ref) => {
      // Simple state management like CompanyNo but with pagination support
      const [vendors, setVendors] = useState<Vendor[]>([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [searchTerm, setSearchTerm] = useState("");
      
      // Force fresh API call on each component mount
      const [mountTimestamp] = useState(() => Date.now());

      const currentPageRef = useRef(1);
      const latestSearchRef = useRef("");

      // Use React Query hook for fetching vendors - like CompanyNo but with search/pagination
      const {
         data: vendorData,
         isLoading,
      } = useVendors(
         Number(companyNo),
         searchTerm,
         currentPage,
         !!companyNo,
         mountTimestamp // Force fresh API call for each component instance
      );

      // Handle vendor data updates - always update local state from React Query
      useEffect(() => {
         if (vendorData && vendorData.items) {
            if (currentPage === 1 || searchTerm !== latestSearchRef.current) {
               // First page or new search - replace all vendors (like CompanyNo)
               setVendors(vendorData.items);
               latestSearchRef.current = searchTerm;
            } else {
               // Subsequent pages - append to existing vendors (pagination)
               setVendors(prev => {
                  // Avoid duplicates when appending
                  const existingIds = new Set(prev.map(v => v.id));
                  const newItems = vendorData.items.filter(item => !existingIds.has(item.id));
                  return [...prev, ...newItems];
               });
            }
         }
      }, [vendorData, currentPage, searchTerm]);

      // Ensure vendors are populated when component mounts with existing data
      useEffect(() => {
         if (vendorData && vendorData.items && vendors.length === 0 && currentPage === 1) {
            setVendors(vendorData.items);
         }
      }, [vendorData, vendors.length, currentPage]);

      // Reset vendors when company or search changes - like CompanyNo
      useEffect(() => {
         if (!companyNo) return;
         setCurrentPage(1);
         setVendors([]);
         currentPageRef.current = 1;
         latestSearchRef.current = searchTerm;
      }, [companyNo, searchTerm]);

      // Scroll handling for pagination
      const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
         const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
         const nearBottom = scrollTop + clientHeight >= scrollHeight - 10;

         if (nearBottom && !isLoading && vendorData && currentPage < vendorData.totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            currentPageRef.current = nextPage;
         }
      };

      // Debounced search - keep this functionality
      const debouncedSearch = useCallback(
         debounce((val: string) => {
            setSearchTerm(val);
            setCurrentPage(1);
            currentPageRef.current = 1;
            latestSearchRef.current = val;
            setVendors([]);
         }, 300),
         [companyNo]
      );

      const handleSearch = (val: string) => {
         if (val.length >= 3) {
            debouncedSearch(val);
         } else if (val.length === 0) {
            // Cancel any pending debounced search
            debouncedSearch.cancel();
            setSearchTerm("");
            setCurrentPage(1);
            currentPageRef.current = 1;
            latestSearchRef.current = "";
            setVendors([]);
         }
         // For lengths 1-2, do nothing (don't search, don't reset)
      };

      // Cleanup debounced function on unmount
      useEffect(() => {
         return () => {
            debouncedSearch.cancel();
         };
      }, [debouncedSearch]);

      // Create dropdown options from vendor data - like CompanyNo
      const vendorOptions = vendors.map((vendor) => ({
         label: `${vendor.id} - ${vendor.value}`,
         value: vendor.id,
      }));

      useImperativeHandle(ref, () => ({
         resetVendor: () => {
            onChange("");
         },
         getVendorName: (vendorId: string) => {
            const vendor = vendors.find((v) => v.id === vendorId);
            return vendor ? vendor.value : undefined;
         },
      }));

      return (
         <div>
            <p className="sub-title required">Vendor No/Name</p>
            <CustomSearchableSelect
               name="VendorNumberName"
               options={vendorOptions}
               value={value}
               onChange={onChange}
               placeholder={vendorNoName}
               className="ui-dropdown-vnn"
               disabled={disabled}
               showSearch
               onSearch={handleSearch}
               onPopupScroll={handleScroll}
               filterOption={false}
               loading={isLoading}
            />
         </div>
      );
   }
);

VendorNumberName.displayName = "VendorNumberName";

export default VendorNumberName;