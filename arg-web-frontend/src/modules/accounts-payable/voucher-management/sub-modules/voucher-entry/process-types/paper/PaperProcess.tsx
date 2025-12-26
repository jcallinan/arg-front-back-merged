import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { TabsProps } from "antd";
import TabsContent from "../../../../../../../widget-library/Tabs";
import FrieghtInvoiceImportSection from "./tabs/freight-invoice-import/FrieghtInvoiceImportSection";
import ReviewBatch from "./tabs/review-batch/ReviewBatch";
import Toaster from "../../../../../../../widget-library/Toaster";
import type { PaperProcessProps } from "@/types/accounts-payable.types";



const PaperProcess: React.FC<PaperProcessProps> = ({
  uploadStatusData,
  defaultActiveTab,
}) => {
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

  const showToaster = (
    type: "error" | "success" | "warning" | "batch",
    title: string,
    subtitle: string
  ) => {
    setToaster({ type, title, subtitle });
  };

  // Refs to trigger API calls in child components
  const freightInvoiceRef = useRef<{ refreshData: () => void } | null>(null);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "1") {
      freightInvoiceRef.current?.refreshData();
    }
  };

  const handleBatchSuccess = (apiMessage?: string) => {
    // Defer switching to Review until WebSocket confirms completion
    setPendingSwitchToReview(true);
    setPendingSuccessMessage(apiMessage);
    setSeenProcessingSincePending(false);
    setPrevStatusIdAtStart(lastStatusId);
    showToaster(
      "batch",
      "Processing batch...",
      "Please wait while the batch is being created."
    );
  };

  // Track latest websocket status id (if provided by backend)
  useEffect(() => {
    if (uploadStatusData?.id) {
      setLastStatusId(uploadStatusData.id);
    }
  }, [uploadStatusData?.id]);

  // Auto-switch to Review tab when Paper websocket reports Completed
  useEffect(() => {
    if (!pendingSwitchToReview) return;
    const isNewStatusId =
      uploadStatusData?.id && uploadStatusData.id !== prevStatusIdAtStart;

    // Accept a new Processing or directly a new Completed with a new id
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

  useEffect(() => {
    setActiveTab(defaultActiveTab ?? "1");
  }, [defaultActiveTab]);

  useEffect(() => {
    const state = location.state as { successMessage?: string } | undefined;
    if (state?.successMessage) {
      setActiveTab("2");
    }
  }, [location.state]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Freight Invoice Import Selection",
      children: (
        <FrieghtInvoiceImportSection
          ref={freightInvoiceRef}
          showToaster={showToaster}
          onBatchSuccess={handleBatchSuccess}
          isProcessing={pendingSwitchToReview}
        />
      ),
    },
    {
      key: "2",
      label: "Review Batch",
      children: (
        <ReviewBatch
          uploadStatusData={uploadStatusData}
          enabledQueries={activeTab === "2"}
        />
      ),
    },
  ];

  return (
    <>
      <TabsContent
        items={items}
        activeKey={activeTab}
        onChange={handleTabChange}
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

export default PaperProcess;
