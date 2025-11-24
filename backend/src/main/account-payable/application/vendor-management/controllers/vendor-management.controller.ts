import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import * as SwaggerConfig from "@src/api-schema/vendor-management.swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { paginatedResponse, PaginatedResponse, SimpleResponse, simpleResponse } from "@src/shared/utils/response-formatter";
import { vendorDetailDto, vendorandVendorContactDetailsInputDto, vendorMasterListDto, vendorNextNoConfig, vendorOwnerDetailsDto, vendorOwnerDto, vendorOwnerList, VendorResponseDto } from "../dto/vendor-management.dto";
import { VendorMasterListUsecase } from "../usecases/vendor-master-list/vendor-master-list.usecase";
import { CreateUpdateVendorUsecase } from "../usecases/create-and-update-vendor/create-and-update-vendor.usecase";
import { VendorTypesUsecase } from "../usecases/get-vendor-types/get-vendor-types.usecase";
import { GetVendorOwnerMappingList } from "../usecases/get-vendor-owner-mapping-list/get-vendor-owner-mapping-list.usecase";
import { CreateUpdateVendorOwnerUsecase } from "../usecases/create-and-update-owner-mapping/create-and-update-owner-mapping.usecase";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";
import { VendorOwnerDetailsUsecase } from "../usecases/get-vendor-owner-details/get-vendor-owner-details.usecase";
import { GetVendorOwnerDropdown } from "../usecases/get-vendor-owner-dropdown/get-vendor-owner-dropdown.usecase";
import { DropdownType } from "@src/types/types";
import { GetVendorNumberConfigUsecase } from "../usecases/get-vendor-no/get-vendor-no.usecase";
import { VendorDetailsUsecase } from "../usecases/get-vendor-details/get-vendor-details.usecase";
import { GetAllVendorsDto } from "../../voucher/dto/voucher.dto";
import { formatVendorDropdown } from "@src/shared/formatters/dropdown.formatter";
import { GetAllVendorUseCase } from "../usecases/get-vendor-list/get-vendor-list.usecase";



@ApiTags("Vendor Management")
@Controller("vendor-management")
export class VendorManagementController {
    constructor(
        private readonly getVendorMasterListUsecase: VendorMasterListUsecase,
        private readonly createUpdateVendorUsecase: CreateUpdateVendorUsecase,
        private readonly vendorTypesUsecase: VendorTypesUsecase,
        private readonly getVendorOwnerMappingList: GetVendorOwnerMappingList,
        private readonly createUpdateVendorOwnerUsecase: CreateUpdateVendorOwnerUsecase,
        private readonly vendorOwnerDetailsUsecase: VendorOwnerDetailsUsecase,
        private readonly getVendorOwnerDropdown: GetVendorOwnerDropdown,
        private readonly getVendorNumberConfigUsecase: GetVendorNumberConfigUsecase,
        private readonly getVendorDetailsUsecase: VendorDetailsUsecase,
        private readonly getAllVendorUseCase: GetAllVendorUseCase,

    ) { }


    @Get("types")
    @ApiEndpoint(SwaggerConfig.vendorTypes)
    async getVendorTypes(): Promise<any> {
        const result = await this.vendorTypesUsecase.execute();
        return result;
    }



    @Get("list")
    @ApiEndpoint(SwaggerConfig.getVendorList)
    async getVendorMasterList(@Query() dto: vendorMasterListDto): Promise<PaginatedResponse<Vendor>> {
        const result = await this.getVendorMasterListUsecase.execute(dto);
        return result;
    }


    @Post("")
    @ApiEndpoint(SwaggerConfig.createOrUpdateVendor)
    async addNewVendor(@Body() dto: vendorandVendorContactDetailsInputDto): Promise<{ message: string }> {
        const result = await this.createUpdateVendorUsecase.execute(dto);
        return result;
    }


    @Get("owner-mapping")
    @ApiEndpoint(SwaggerConfig.getOwnerMappingList)
    async getOwnerMappingList(@Query() dto: vendorOwnerList): Promise<PaginatedResponse<{
        items: OwnerVendorEntity[];
        total_items: number;
        current_page: number;
        items_per_page: number;
        total_pages: number,
    }>> {
        const result = await this.getVendorOwnerMappingList.execute(dto);
        return result;
    }

    @Get("owner")
    @ApiEndpoint(SwaggerConfig.getOwnerDetails)
    async getOwnerDetails(@Query() dto: vendorOwnerDetailsDto): Promise<OwnerVendorEntity | null> {
        const result = await this.vendorOwnerDetailsUsecase.execute(dto);
        return result;
    }

    @Post("owner")
    @ApiEndpoint(SwaggerConfig.CreateAndUpdateOwner)
    async CreateAndUpdateOwner(@Body() dto: vendorOwnerDto): Promise<{ message: string }> {
        const result = await this.createUpdateVendorOwnerUsecase.execute(dto);
        return result;
    }


    @Get("/details")
    @ApiEndpoint(SwaggerConfig.getVendorDetails)
    async getVendorDetails(@Query() dto: vendorDetailDto): Promise<SimpleResponse<VendorResponseDto>> {
        const result = await this.getVendorDetailsUsecase.execute(dto);
        return simpleResponse(result);
    }


    @Get("owner-no/list")
    @ApiEndpoint(SwaggerConfig.getOwnerNoList)
    async getOwnerNoList(@Query() dto: vendorOwnerList): Promise<DropdownType[]> {
        const result = await this.getVendorOwnerDropdown.execute(dto);
        return result;
    }


    @Get("config")
    @ApiEndpoint(SwaggerConfig.getNextVendorNoConfig)
    async getNextVendorNoConfig(@Query() dto: vendorNextNoConfig): Promise<SimpleResponse<number>> {

        const { companyNo } = dto

        const config = await this.getVendorNumberConfigUsecase.execute(
            companyNo,
        );
        return simpleResponse(config);
    }

    @Get("all-vendors")
    @ApiEndpoint(SwaggerConfig.getAllVendors)
    async getAllVendorsList(@Query() query: GetAllVendorsDto) {
        const {
            items,
            pagination: { total_items, current_page, items_per_page },
        } = await this.getAllVendorUseCase.execute(query);
        return paginatedResponse(
            formatVendorDropdown(items),
            total_items,
            current_page,
            items_per_page
        );
    }
}
