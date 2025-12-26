import React from "react";
import { Skeleton } from "antd";
import type { CustomSkeletonProps } from "./widgetLibrary.types";

export const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
   name,
   ...rest
}) => {
   return <Skeleton data-name={name} {...rest} />;
};
