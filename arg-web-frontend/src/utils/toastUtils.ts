import { notification } from "antd";

/**
 * Toast utility for showing notifications from non-React code
 * Uses Ant Design's notification API
 */

export const showToast = {
   error: (title: string, description?: string) => {
      notification.error({
         message: title,
         description: description,
         placement: "topRight",
         duration: 0, // 0 means the notification stays until user closes it
      });
   },
   
   warning: (title: string, description?: string) => {
      notification.warning({
         message: title,
         description: description,
         placement: "topRight",
         duration: 0, // 0 means the notification stays until user closes it
      });
   },
   
   success: (title: string, description?: string) => {
      notification.success({
         message: title,
         description: description,
         placement: "topRight",
         duration: 0, // 0 means the notification stays until user closes it
      });
   },
   
   info: (title: string, description?: string) => {
      notification.info({
         message: title,
         description: description,
         placement: "topRight",
         duration: 0, // 0 means the notification stays until user closes it
      });
   },
};

