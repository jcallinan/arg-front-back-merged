// mockData/checkPaymentHistoryMockData.ts
import type { CheckPaymentHistoryUI } from "@type-definitions/accounts-payable.types";

export const checkPaymentHistoryMockData: CheckPaymentHistoryUI[] = [
  {
    key: '1',
    vendorCard: 'ABSG CONSULTING',
    openPayables: '$5,881.50',
    paidDate: '05/02/2025',
    checkNo: 'CHK001',
    invoiceNo: 'INV-2025-001',
    invoiceDescription: 'Consulting Services - Q1 2025',
    grossAmount: '$4,500.00',
    discountAmount: '$187.50',
    paidAmount: '$4,312.50',
    bankStatus: 'Cleared'
  },
  {
    key: '2',
    vendorCard: 'TECH SOLUTIONS INC',
    openPayables: '$3,245.75',
    paidDate: '04/28/2025',
    checkNo: 'CHK002',
    invoiceNo: 'INV-2025-002',
    invoiceDescription: 'Software License Renewal',
    grossAmount: '$3,500.00',
    discountAmount: '$75.00',
    paidAmount: '$3,425.00',
    bankStatus: 'To be Cleared'
  },
  {
    key: '3',
    vendorCard: 'OFFICE SUPPLIES CO',
    openPayables: '$1,125.25',
    paidDate: '04/25/2025',
    checkNo: 'CHK003',
    invoiceNo: 'INV-2025-003',
    invoiceDescription: 'Office Equipment and Supplies',
    grossAmount: '$1,200.00',
    discountAmount: '$25.00',
    paidAmount: '$1,175.00',
    bankStatus: 'Cleared'
  },
  {
    key: '4',
    vendorCard: 'MARKETING AGENCY LLC',
    openPayables: '$7,500.00',
    paidDate: '04/20/2025',
    checkNo: 'CHK004',
    invoiceNo: 'INV-2025-004',
    invoiceDescription: 'Digital Marketing Campaign - April',
    grossAmount: '$8,000.00',
    discountAmount: '$200.00',
    paidAmount: '$7,800.00',
    bankStatus: 'Cleared'
  },
  {
    key: '5',
    vendorCard: 'UTILITY SERVICES',
    openPayables: '$850.30',
    paidDate: '04/15/2025',
    checkNo: 'CHK005',
    invoiceNo: 'INV-2025-005',
    invoiceDescription: 'Monthly Utility Bills - March',
    grossAmount: '$850.30',
    discountAmount: '$0.00',
    paidAmount: '$850.30',
    bankStatus: 'Cleared'
  },
  {
    key: '6',
    vendorCard: 'LEGAL ASSOCIATES',
    openPayables: '$2,750.00',
    paidDate: '04/10/2025',
    checkNo: 'CHK006',
    invoiceNo: 'INV-2025-006',
    invoiceDescription: 'Legal Consultation Services',
    grossAmount: '$3,000.00',
    discountAmount: '$150.00',
    paidAmount: '$2,850.00',
    bankStatus: 'To be Cleared'
  }
];

