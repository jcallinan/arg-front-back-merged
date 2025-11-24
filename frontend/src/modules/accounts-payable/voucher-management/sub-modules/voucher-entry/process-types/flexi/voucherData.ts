//import type { VoucherModalData } from "../../../../../../../widget-library/widgetLibrary.types";

export const mockVoucherModalData: any = {
   vendorName: "ABC Corporation",
   vendorNo: "00123",
   invoiceNo: "INV-001",
   invoiceDate: "07/13/2025",
   discountDueDate: "07/20/2025",
   dueDate: "07/25/2025",
   invoiceAmount: 120000,
   invoiceDesc: "Office Supplies",
   prepaidCode: "No",
   singleCheck: "Yes",
   detailItems: [
      {
         productAmount: 50000,
         lineDesc: "Notebooks",
         lineGlNo: "3001",
         discountAmount: 5000,
         poNo: "PO-122",
         poLineNo: "1",
         quantity: 100,
         openClosed: "Open",
      },
   ],
};
