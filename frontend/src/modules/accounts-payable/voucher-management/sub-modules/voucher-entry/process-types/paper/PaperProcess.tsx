import React, { useState, useEffect } from "react";
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

  const showToaster = (
    type: "error" | "success" | "warning" | "batch",
    title: string,
    subtitle: string
  ) => {
    setToaster({ type, title, subtitle });
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleBatchSuccess = (apiMessage?: string) => {
    // Navigate to Review Batch tab
    setActiveTab("2");

    // Show API message if available
    const subtitle = apiMessage || "Batch has been created successfully.";
    showToaster("success", "Success!", subtitle);
  };

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
          showToaster={showToaster}
          onBatchSuccess={handleBatchSuccess}
        />
      ),
    },
    {
      key: "2",
      label: "Review Batch",
      children: <ReviewBatch uploadStatusData={uploadStatusData} />,
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
