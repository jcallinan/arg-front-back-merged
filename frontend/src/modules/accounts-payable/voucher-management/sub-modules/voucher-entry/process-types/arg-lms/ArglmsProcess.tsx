import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { TabsProps } from "antd";
import TabsContent from "../../../../../../../widget-library/Tabs";
import FrieghtInvoiceImportSection from "./tabs/freight-invoice-import/FrieghtInvoiceImportSection";
import ReviewBatch from "./tabs/review-batch/ReviewBatch";
import Toaster from "../../../../../../../widget-library/Toaster";
import type { ArglmsProcessProps } from "@/types/accounts-payable.types";



const ArglmsProcess: React.FC<
  ArglmsProcessProps & { uploadStatusData?: any }
> = ({ uploadStatusData, defaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab ?? "1");
  const location = useLocation();
  const [toaster, setToaster] = useState<{
    type: "error" | "success" | "warning" | "batch";
    title: string;
    subtitle: string;
  } | null>(null);
  
  // Refs to trigger API calls in child components
  const freightInvoiceRef = useRef<{ refreshData: () => void } | null>(null);
  const reviewBatchRef = useRef<{ refreshData: () => void } | null>(null);

  const showToaster = (
    type: "error" | "success" | "warning" | "batch",
    title: string,
    subtitle: string
  ) => {
    setToaster({ type, title, subtitle });
  };

  const handleTabChange = (key: string) => {
   
    setActiveTab(key);
    
    // Call respective API when tab becomes active
    if (key === "1" && freightInvoiceRef.current) {
    
      freightInvoiceRef.current.refreshData();
    } else if (key === "2" && reviewBatchRef.current) {
   
      reviewBatchRef.current.refreshData();
    }
  };

  const handleBatchSuccess = (apiMessage?: string) => {
    // Navigate to Review Batch tab
    setActiveTab("2");
    
    // Refresh review batch data after batch creation
    setTimeout(() => {
      if (reviewBatchRef.current) {
      
        reviewBatchRef.current.refreshData();
      }
    }, 100); // Small delay to ensure tab is active

    // Show API success message if provided
    const subtitle = apiMessage || "Batch has been created successfully.";
    showToaster("success", "Success!", subtitle);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Freight Invoice Import Section",
      children: (
        <div>
          <FrieghtInvoiceImportSection
            ref={freightInvoiceRef}
            showToaster={showToaster}
            onBatchSuccess={handleBatchSuccess}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Review Batch",
      children: (
        <div>
          <ReviewBatch
            ref={reviewBatchRef}
            selectedCompany={""}
            uploadStatusData={uploadStatusData}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setActiveTab(defaultActiveTab ?? "1");
  }, [defaultActiveTab]);

  useEffect(() => {
    const state = location.state as { successMessage?: string } | undefined;
    if (state?.successMessage) {
      setActiveTab("2");
    }
  }, [location.state]);

  return (
    <>
      <TabsContent
        items={items}
        onChange={handleTabChange}
        activeKey={activeTab}
      />
      {toaster && (
        <Toaster
          type={toaster.type}
          title={toaster.title}
          subtitle={toaster.subtitle}
          onClose={() => setToaster(null)}
        />
      )}
    </>
  );
};

export default ArglmsProcess;
