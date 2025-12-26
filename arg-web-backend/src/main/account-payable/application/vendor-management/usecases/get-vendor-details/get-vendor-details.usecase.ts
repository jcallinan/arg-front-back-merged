import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VendorContactDetailsDto, vendorDetailDto, VendorResponseDto } from "../../dto/vendor-management.dto";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { GeneralSystemInterface } from "@src/main/account-payable/domain/interface/general-system.interface";
import { VendorDescriptionList } from "@src/shared/constants/constant";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";


@Injectable()
export class VendorDetailsUsecase {
    private readonly logger = new AppLogger(VendorDetailsUsecase.name);

    constructor(
        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface,
        
        @Inject("GeneralSystemInterface")
        private readonly generalSystemInterface: GeneralSystemInterface,
    ) { }

    async execute(data: vendorDetailDto): Promise<VendorResponseDto> {

        this.logger.log(`Get vendor details along with vendor Contacts`);

        const { vendorCompanyNumber, vendorNo } = data

        // Interface Call
        const vendorDetails = await this.vendorInterface.getVendorAndContactDetails(vendorCompanyNumber, vendorNo);

        if (!vendorDetails) {
            this.logger.warn("Vendor Details and Contact Details not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "vendorOwner",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Vendor Details and Contact Details not found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }
        
        // Fetch descriptions for vendor fields
        const vendorWithDescriptions = await this.fetchVendorDescriptions(vendorDetails.vendor);
        
        // Fetch formType descriptions for contact details
        const contactDetailsWithDescriptions = await this.fetchContactDescriptions(vendorDetails.vendorContactDetails);
        
        return {
            vendor: vendorWithDescriptions,
            vendorContactDetails: contactDetailsWithDescriptions
        };
    }

    private async fetchVendorDescriptions(vendor: Vendor): Promise<Vendor> {
        this.logger.debug('Starting vendor description fetching');
        
        const descriptionPromises: Promise<any>[] = [];
        const descriptionKeys: string[] = [];

        // Define the fields to check for descriptions with their description field names and data types
        const descriptionFields = [
            { key: 'vendorApTermsCode', tableType: VendorDescriptionList.vendorApTermsCode, descriptionKey: 'vendorApTermsCodeDescription', dataType: 'number' },
            { key: 'vendorAp1099Code', tableType: VendorDescriptionList.vendorAp1099Code, descriptionKey: 'vendorAp1099CodeDescription', dataType: 'string' },
            { key: 'vendorCategoryCode', tableType: VendorDescriptionList.vendorCategoryCode, descriptionKey: 'vendorCategoryCodeDescription', dataType: 'string' },
        ];

        // Loop through each field and fetch description if value exists
        descriptionFields.forEach(({ key, tableType }) => {
            const value = (vendor as any)[key];
            
            if (value !== null && value !== undefined && value.toString().trim() !== '') {
                descriptionPromises.push(
                    this.generalSystemInterface.getDropdownlist(tableType, 1000, 0)
                );
                descriptionKeys.push(key);
            }
        });

        // Execute all description queries in parallel
        this.logger.debug(`Fetching ${descriptionPromises.length} dropdown lists`);
        const dropdownResults = await Promise.all(descriptionPromises);

        // Add descriptions to vendor
        const vendorWithDescriptions = { ...vendor } as any;
        
        // Initialize all description fields with empty strings
        descriptionFields.forEach(({ descriptionKey }) => {
            vendorWithDescriptions[descriptionKey] = '';
        });
        
        // Add fetched descriptions by matching tableCode
        dropdownResults.forEach((dropdownResult, index) => {
            const key = descriptionKeys[index];
            const fieldConfig = descriptionFields.find(field => field.key === key);
            
            if (fieldConfig) {
                const value = (vendor as any)[fieldConfig.key];
                
                if (value !== null && value !== undefined && value.toString().trim() !== '') {
                    let valueStr: string;
                    
                    // Handle different data types based on vendor model
                    if (fieldConfig.dataType === 'number') {
                        const numValue = Number(value);
                        // Special handling for vendorApTermsCode: pad 1-9 with leading zero
                        if (fieldConfig.key === 'vendorApTermsCode') {
                            if (numValue >= 1 && numValue <= 9) {
                                valueStr = `0${numValue}`; // 1 -> "01", 2 -> "02", etc.
                            } else {
                                valueStr = numValue.toString(); // 10 -> "10", 11 -> "11", etc.
                            }
                        } else {
                            // For other numbers, just convert to string
                            valueStr = numValue.toString();
                        }
                    } else {
                        // For strings, just trim
                        valueStr = value.toString().trim();
                    }
                    
                    const matchedRecord = dropdownResult.rows.find(record => 
                        record.tableCode.trim() === valueStr
                    );
                    
                    if (matchedRecord) {
                        vendorWithDescriptions[fieldConfig.descriptionKey] = matchedRecord.tableDesc.trim();
                    }
                }
            }
        });

        this.logger.debug('Vendor description fetching completed');
        return vendorWithDescriptions;
    }

    private async fetchContactDescriptions(contactDetails: any[]): Promise<VendorContactDetailsDto[]> {
        this.logger.debug(`Starting contact description fetching for ${contactDetails?.length || 0} contacts`);
        
        if (!contactDetails || contactDetails.length === 0) {
            return contactDetails;
        }

        // Get unique formType values from all contacts
        const uniqueFormTypes = [...new Set(contactDetails.map(contact => contact.formType).filter(Boolean))];
        
        if (uniqueFormTypes.length === 0) {
            this.logger.debug('No formTypes found in contacts');
            return contactDetails.map(contact => ({
                ...contact,
                formtypeDescription: ''
            }));
        }

        // Fetch descriptions for all unique formTypes
        this.logger.debug(`Fetching formType descriptions for unique types: ${uniqueFormTypes.join(', ')}`);
        const formTypeDescriptions = await this.generalSystemInterface.getDropdownlist(
            VendorDescriptionList.formtype,
            1000,
            0
        );

        // Map contact details with descriptions
        const result = contactDetails.map(contact => {
            const formType = contact.formType;
            let formtypeDescription = '';

            if (formType && formType.trim() !== '') {
                const matchedRecord = formTypeDescriptions.rows.find(record => 
                    record.tableCode.trim() === formType.trim()
                );
                
                if (matchedRecord) {
                    formtypeDescription = matchedRecord.tableDesc.trim();
                }
            }

            return {
                ...contact,
                formtypeDescription
            };
        });

        this.logger.debug(`Contact description fetching completed ${result}`);
        return result;
    }
}
