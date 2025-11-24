// src/widget-library/SpinLoader.tsx
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface SpinLoaderProps {
   size?: "small" | "default" | "large";
   customFontSize?: number;
   className?: string;
}

const SpinLoader: React.FC<SpinLoaderProps> = ({
   size = "default",
   customFontSize,
   className = "",
}) => {
   const indicator = customFontSize ? (
      <LoadingOutlined style={{ fontSize: customFontSize }} spin />
   ) : (
      <LoadingOutlined spin />
   );

   return (
      <Spin
         indicator={indicator}
         size={customFontSize ? undefined : size}
         className={className}
      />
   );
};

export default SpinLoader;
