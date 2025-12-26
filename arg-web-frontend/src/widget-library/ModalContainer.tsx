import React, { useState, useEffect } from "react";
import ModalContent from "./Modal";
import { MODAL_EVENT, type ModalEvent } from "@utils/modalUtils";

// Import icons for different modal types
import errorIcon from "@assets/icons/error-icon.svg";
import warningIcon from "@assets/icons/warning-icon.svg";
import successIcon from "@assets/icons/success-icon.svg";
import infoIcon from "@assets/icons/info-circle-icon.svg";

/**
 * Global ModalContainer component that listens to modal events
 * and renders the ModalContent component accordingly.
 * 
 * This should be mounted once at the app root level.
 */
const ModalContainer: React.FC = () => {
   const [modal, setModal] = useState<(ModalEvent & { id: string }) | null>(null);

   useEffect(() => {
      const handleModalEvent = (event: Event) => {
         const customEvent = event as CustomEvent<ModalEvent>;
         const modalData = customEvent.detail;

         // Generate a unique ID for this modal
         const id = `modal-${Date.now()}-${Math.random()}`;

         // Set the modal (only one modal at a time)
         setModal({ ...modalData, id });
      };

      // Listen for modal events
      window.addEventListener(MODAL_EVENT, handleModalEvent);

      // Cleanup listener on unmount
      return () => {
         window.removeEventListener(MODAL_EVENT, handleModalEvent);
      };
   }, []);

   const handleCloseModal = () => {
      if (modal?.onClose) {
         modal.onClose();
      }
      setModal(null);
   };

   // Get icon based on modal type
   const getModalIcon = (type: string) => {
      switch (type) {
         case "error":
            return errorIcon;
         case "warning":
            return warningIcon;
         case "success":
            return successIcon;
         case "info":
            return infoIcon;
         default:
            return infoIcon;
      }
   };

   if (!modal) return null;

   return (
      <ModalContent
         title={modal.title}
         description={modal.description || ""}
         visible={true}
         onCancel={handleCloseModal}
         showCloseIcon={true}
         imageUrl={getModalIcon(modal.type)}
         actions={[
            {
               name: "ok",
               label: "OK",
               onClick: handleCloseModal,
            },
         ]}
         className="modal-utility modal-center-text"
      />
   );
};

export default ModalContainer;

