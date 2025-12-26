import React, { useState } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps, GetProp } from "antd";
import type { CustomImageUploaderProps } from "./widgetLibrary.types";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });

   
export const CustomImageUploader: React.FC<CustomImageUploaderProps> = ({
   name,
   action,
   fileList,
   onChange,
}) => {
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewImage, setPreviewImage] = useState("");

   const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj as FileType);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
   };

   const uploadButton = (
      <button
         type="button"
         style={{ border: 0, background: "none" }}
         data-name={name}
      >
         <PlusOutlined />
         <div style={{ marginTop: 8 }}>Upload</div>
      </button>
   );

   return (
      <>
         <Upload
            data-name={name}
            action={action}
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={(info) => onChange(info)}
         >
            {fileList.length >= 8 ? null : uploadButton}
         </Upload>
         {previewImage && (
            <Image
               wrapperStyle={{ display: "none" }}
               preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
               }}
               src={previewImage}
            />
         )}
      </>
   );
};
