import { Model, Sequelize } from "@sequelize/core";
import { openPayableDetailsSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { OpenPayableHeaderModel } from "./open-payable-header.model";

/**
 * Open Payable Details Model (APOPND)
 * Represents the details line items for open payables
 */
export class OpenPayableDetailsModel extends Model {
  // Primary Key Fields
  public isDeleted!: string;         
  public companyNo!: number;       
  public vendorNo!: number;       
  public voucherNo!: number;       
  public detailType!: number;       
  public sequenceNo!: number;       
  
  // Amount Fields
  public grossAmount!: number;       
  public discountAmount!: number;    
  public partialPaidToDate!: number; 
  
  // Description and GL Information
  public lineDescription!: string;   
  public expenseGlAccount!: number;  
  public expenseCompanyNo!: number;
  
  // Date Fields
  public lastPaidDate6!: number;     
  
  // Reference Fields
  public purchaseJournalNo!: string; 
  public inventoryItemNo!: string;   
  
  // Quantity Fields
  public quantity!: number;  
  public gallons!: number;
  
  // Job Costing
  public jobNo!: string;             
  public jobExtraField!: string;     
  public costCode!: string;          
  public costType!: string;          
  public jobCostQuantity!: number;   
  
  // Purchase Order References
  public purchaseOrderNo!: string;   
  public receiptNumber!: number;     
  public poStatus!: string;          
  public poLineSequenceNo!: number;  
  
  // Amount Fields
  public productAmount!: number;     
  public freightAmount!: number;     
  
  // Date Field (8-digit format)
  public lastPaidDate8!: number;     
  
  // Reference
  public poNumber!: string;          

  static associate() {
    // Each detail record belongs to a header
    OpenPayableDetailsModel.belongsTo(OpenPayableHeaderModel, {
      foreignKey: 'voucherNo',
      targetKey: 'voucherNo',
      as: 'header'
    });

    OpenPayableDetailsModel.belongsTo(OpenPayableHeaderModel, {
      foreignKey: "voucherNo",
      targetKey: "voucherNo",
      as: "voucherDetails",
    });
  }
}

// Initialize the Open Payable Details model
export function initializeOpenPayableDetailsModel(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OpenPayableDetailsModel,
    "OpenPayableDetails",
    openPayableDetailsSchema
  );
}
