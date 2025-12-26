/**
 * Modal utility for showing modal dialogs from non-React code
 * Uses a custom event system to trigger modal components
 */

export type ModalType = "error" | "success" | "warning" | "info";

export interface ModalEvent {
   type: ModalType;
   title: string;
   description?: string;
   onClose?: () => void;
}

// Custom event name for modal notifications
const MODAL_EVENT_NAME = "app:show-modal";

/**
 * Emit a modal event that will be caught by the ModalContainer component
 */
const emitModalEvent = (event: ModalEvent) => {
   const customEvent = new CustomEvent(MODAL_EVENT_NAME, {
      detail: event,
   });
   window.dispatchEvent(customEvent);
};

/**
 * Modal utility functions to show different types of modal dialogs
 */
export const showModal = {
   error: (title: string, description?: string, onClose?: () => void) => {
      emitModalEvent({
         type: "error",
         title,
         description: description || "",
         onClose,
      });
   },

   warning: (title: string, description?: string, onClose?: () => void) => {
      emitModalEvent({
         type: "warning",
         title,
         description: description || "",
         onClose,
      });
   },

   success: (title: string, description?: string, onClose?: () => void) => {
      emitModalEvent({
         type: "success",
         title,
         description: description || "",
         onClose,
      });
   },

   info: (title: string, description?: string, onClose?: () => void) => {
      emitModalEvent({
         type: "info",
         title,
         description: description || "",
         onClose,
      });
   },
};

/**
 * Hook for React components to listen to modal events
 * Returns the event name that components should listen to
 */
export const MODAL_EVENT = MODAL_EVENT_NAME;

