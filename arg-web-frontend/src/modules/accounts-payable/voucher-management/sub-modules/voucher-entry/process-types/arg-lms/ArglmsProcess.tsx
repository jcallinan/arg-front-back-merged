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
  const [pendingSwitchToReview, setPendingSwitchToReview] = useState(false);
  const [pendingSuccessMessage, setPendingSuccessMessage] = useState<string | undefined>(undefined);
  const [seenProcessingSincePending, setSeenProcessingSincePending] = useState(false);
  const [lastStatusId, setLastStatusId] = useState<string | undefined>(undefined);
  const [prevStatusIdAtStart, setPrevStatusIdAtStart] = useState<string | undefined>(undefined);
  
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
    }
  };

  const handleBatchSuccess = (apiMessage?: string) => {
    // Defer tab switch until WebSocket confirms processing is Completed
    setPendingSwitchToReview(true);
    setPendingSuccessMessage(apiMessage);
    setSeenProcessingSincePending(false);
    // Snapshot the last seen websocket id at the moment batch creation finishes
    setPrevStatusIdAtStart(lastStatusId);
    showToaster(
      "batch",
      "Processing batch...",
      "Please wait while the batch is being created."
    );
  };

  // Track the latest websocket status id
  useEffect(() => {
    if (uploadStatusData?.id) {
      setLastStatusId(uploadStatusData.id);
    }
  }, [uploadStatusData?.id]);

  // Auto-switch to Review tab when LMS websocket reports Completed
  useEffect(() => {
    if (!pendingSwitchToReview) return;
    const isNewStatusId =
      uploadStatusData?.id && uploadStatusData.id !== prevStatusIdAtStart;

    // Accept either a fresh Processing (optional) or directly a fresh Completed with a new id
    if (uploadStatusData?.status === "Processing" && isNewStatusId) {
      setSeenProcessingSincePending(true);
    }
    if (
      uploadStatusData?.status === "Completed" &&
      (isNewStatusId || seenProcessingSincePending)
    ) {
      setActiveTab("2");

      const subtitle =
        pendingSuccessMessage || "Batch has been created successfully.";
      showToaster("success", "Success!", subtitle);

      setPendingSwitchToReview(false);
      setPendingSuccessMessage(undefined);
      setSeenProcessingSincePending(false);
      setPrevStatusIdAtStart(undefined);
    }
  }, [
    uploadStatusData,
    pendingSwitchToReview,
    pendingSuccessMessage,
    seenProcessingSincePending,
    prevStatusIdAtStart,
  ]);

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
            isProcessing={pendingSwitchToReview}
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
            enabledQueries={activeTab === "2"}
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
