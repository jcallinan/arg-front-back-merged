import React, { useEffect } from "react";

import { notification } from "antd";
import type { ToasterWidgetProps } from "./widgetLibrary.types";

const ToasterWidget: React.FC<ToasterWidgetProps> = ({
  type,
  message,
  description,
  visible,
  onClose,
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (visible) {
      api[type]({
        message,
        description,
        placement: "topRight",
        onClose,
      });
    }
  }, [visible]);

  return <>{contextHolder}</>;
};

export default ToasterWidget;
