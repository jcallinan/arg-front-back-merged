import React, { useRef } from "react";
import { Upload, message } from "antd";
import type { UploadProps } from "antd";
import { DefaultButton } from "../../../../../../../widget-library/Buttons";
import ModalContent from "../../../../../../../widget-library/Modal";
import uploadIcon from "../../../../../../../assets/icons/upload-icon.svg";
import { UPLOAD_CSV_MODAL_TEXTS } from "../../../../../../../constants/commonConstants";
import type { UploadCSVModalProps } from "../../../../../../../types/accounts-payable.types";
import { 
  useUploadFlexiCsv, 
  useUploadSogasCsv, 
  useUploadClearChecks 
} from "../../../../../../../hooks/useUpload";
import "./flexi-process.scss";

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  visible,
  onCancel,
  onUploadSuccess,
  uploadComplete,
  source,
  onUploadError,
  sogasType,
}) => {
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   // React Query hooks for different upload types
   const uploadFlexiCsvMutation = useUploadFlexiCsv();
   const uploadSogasCsvMutation = useUploadSogasCsv();
   const uploadClearChecksMutation = useUploadClearChecks();

   // Map SOGAS type to subType for API
   const getSogasSubType = (sogasType?: string): string => {
      if (sogasType === "SOGAS Tax") {
         return "tax";
      }
      return "regular"; // Default for "SOGAS Regular" or any other value
   };

   const uploadFileViaApiClient = async (file: File) => {
      try {
         if (source === "Flexi") {
            await uploadFlexiCsvMutation.mutateAsync(file);
         } else if (source === "Sogas") {
            const subType = getSogasSubType(sogasType);
            await uploadSogasCsvMutation.mutateAsync({ file, subType });
         } else {
            await uploadClearChecksMutation.mutateAsync(file);
         }

         onUploadSuccess(file.name);
         uploadComplete?.();
         onCancel();
      } catch (err: any) {
         let errorMessage = "Invalid File Selected";
         try {
            if (err instanceof Response) {
               if (!err.bodyUsed) {
                  const responseText = await err.text();
                  try {
                     const responseJson = JSON.parse(responseText); 
                     if (responseJson?.error?.details?.[0]?.message) {
                        errorMessage = responseJson.error.details[0].message;
                    
                     } else if (responseJson?.error?.message) {
                        errorMessage = responseJson.error.message;
                   
                     } else if (responseJson?.message) {
                        errorMessage = responseJson.message;
                      
                     }
                  } catch (parseError) {
                     
                     if (responseText && responseText.trim()) {
                        errorMessage = responseText;
                     }
                  }
               } else {
              
               }
            }
            else if (err?.response?.data?.error?.details?.[0]?.message) {
               errorMessage = err.response.data.error.details[0].message;
            } else if (err?.response?.data?.error?.message) {
               errorMessage = err.response.data.error.message;
            } else if (err?.message) {
               errorMessage = err.message;
            }
         } catch (readError) {
            console.error("Error reading response body:", readError);
         }
         onUploadError?.(errorMessage);
      } finally {
         uploadComplete?.();
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
         return;
      }

      const allowedExtensions = [".csv", ".xlsx", ".xls"];
      const isAllowed = allowedExtensions.some((ext) =>
         file.name.toLowerCase().endsWith(ext)
      );
      const isLt25MB = file.size / 1024 / 1024 < 25;

    if (!isAllowed) {
      const msg = UPLOAD_CSV_MODAL_TEXTS.ERROR_FILE_TYPE;
      message.error(msg);
      onUploadError(msg);
      return;
    }

    if (!isLt25MB) {
      const msg = UPLOAD_CSV_MODAL_TEXTS.ERROR_FILE_SIZE;
      message.error(msg);
      onUploadError(msg);
      return;
    }

      uploadFileViaApiClient(file);
   };

   const uploadProps: UploadProps = {
      name: "file",
      multiple: false,
      maxCount: 1,
      accept: ".csv,.xlsx,.xls",
      showUploadList: false,
      beforeUpload: (file) => {
         handleFileChange({ target: { files: [file] } } as any);
         return false;
      },
   };

   const modalContent = (
      <div className="upload-csv-modal-content flex-column gap-16">
         <Upload.Dragger {...uploadProps}>
            <div className="flex-all">
               <img
                  src={uploadIcon}
                  alt="Upload Icon"
                  className="upload-icon"
               />
            </div>
            <h3 className="h3">{UPLOAD_CSV_MODAL_TEXTS.INSTRUCTION}</h3>
         </Upload.Dragger>

         <p className="p-s guideline-text">{UPLOAD_CSV_MODAL_TEXTS.OR_TEXT}</p>

         <DefaultButton
            name="browseFiles"
            label={UPLOAD_CSV_MODAL_TEXTS.BROWSE_BUTTON}
            onClick={() => {
               if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
               }
            }}
            className="custom-styled-button"
         />

         <div className="file-requirements flex-column gap-16 p-m guideline-text">
            <p>{UPLOAD_CSV_MODAL_TEXTS.SUPPORTED_FORMAT}</p>
            <p>{UPLOAD_CSV_MODAL_TEXTS.MAX_FILE_SIZE}</p>
         </div>

         <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFileChange}
         />
      </div>
   );

   return (
      <ModalContent
         visible={visible}
         onCancel={onCancel}
         title={UPLOAD_CSV_MODAL_TEXTS.TITLE}
         description={modalContent}
         className="upload-csv-modal"
      />
   );
};

export default UploadCSVModal;
