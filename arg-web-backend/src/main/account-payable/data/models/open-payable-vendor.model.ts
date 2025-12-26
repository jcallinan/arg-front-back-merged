import { Model, Sequelize } from "@sequelize/core";
import { openPayableVendorSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { OpenPayableHeaderModel } from "./open-payable-header.model";

/**
 * Open Payable Vendor Model (APOPNV)
 * Represents vendor information for open payables
 */
export class OpenPayableVendorModel extends Model {
  // Primary Key Fields
  public isDeleted!: string;     
  public companyNo!: number;     
  public vendorNo!: number;     
  public voucherNo!: number;     
  
  // Vendor Type and Sequence
  public recordType!: number;    
  public sequenceNo!: number;    
  
  // Vendor Information
  public vendorName!: string;    
  public addressLine1!: string;  
  public addressLine2!: string;  
  public addressLine3!: string;  
  public addressLine4!: string;  
  
  // Filler Fields
  public filler1!: string;     

  static associate() {
    // Each vendor record belongs to a header
    OpenPayableVendorModel.belongsTo(OpenPayableHeaderModel, {
      foreignKey: {
        name: 'vendorNo',
        field: 'OPVEND'
      },
      targetKey: 'vendorNo',
      as: 'header',
      
    });
  }
}

// Initialize the Open Payable Vendor model
export function initializeOpenPayableVendorModel(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OpenPayableVendorModel,
    "OpenPayableVendor",
    openPayableVendorSchema
  );
}
