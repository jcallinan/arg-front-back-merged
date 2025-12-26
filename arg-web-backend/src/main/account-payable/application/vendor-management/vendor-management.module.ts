import { Module } from "@nestjs/common";
import { VendorManagementController } from "./controllers/vendor-management.controller";
import { VendorRepository } from "../../data/repositories/vendor.repository";
import { VendorModel } from "../../data/models/vendor.model";
import { VendorMasterListUsecase } from "./usecases/vendor-master-list/vendor-master-list.usecase";
import { VendorContactDetailModel } from "../../data/models/vendor-contact-detail.model";
import { CreateUpdateVendorUsecase } from "./usecases/create-and-update-vendor/create-and-update-vendor.usecase";
import { VendorSharedService } from "./shared-services/vendor.shared.service";
import { VendorTypesUsecase } from "./usecases/get-vendor-types/get-vendor-types.usecase";
import { GetVendorOwnerMappingList } from "./usecases/get-vendor-owner-mapping-list/get-vendor-owner-mapping-list.usecase";
import { OwnerVendorReferenceModel } from "../../data/models/owner-vendor-reference.model";
import { OwnerVendorReferenceRepository } from "../../data/repositories/owner-vendor-reference.repository";
import { VendorOwnerDetailsUsecase } from "./usecases/get-vendor-owner-details/get-vendor-owner-details.usecase";
import { CreateUpdateVendorOwnerUsecase } from "./usecases/create-and-update-owner-mapping/create-and-update-owner-mapping.usecase";
import { GetVendorOwnerDropdown } from "./usecases/get-vendor-owner-dropdown/get-vendor-owner-dropdown.usecase";
import { CompanyModel } from "../../data/models/company.model";
import { CompanyRepository } from "../../data/repositories/company.repository";
import { GetVendorNumberConfigUsecase } from "./usecases/get-vendor-no/get-vendor-no.usecase";
import { VendorDetailsUsecase } from "./usecases/get-vendor-details/get-vendor-details.usecase";
import { GetAllVendorUseCase } from "./usecases/get-vendor-list/get-vendor-list.usecase";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { GeneralSystemRepository } from "@src/main/account-payable/data/repositories/general-system.repository";
import { GeneralSystemModel } from "@src/main/account-payable/data/models/general-system.model";


@Module({
    imports: [],
    controllers: [VendorManagementController],
    providers: [
        // Models
        {
            provide: "VendorModel",
            useValue: VendorModel,
        },
        {
            provide: "CompanyModel",
            useValue: CompanyModel,
        },
        {
            provide: "VendorContactDetailModel",
            useValue: VendorContactDetailModel,
        },
        {
            provide: "OwnerVendorReferenceModel",
            useValue: OwnerVendorReferenceModel,
        },
        {
            provide: "GeneralSystemModel",
            useValue: GeneralSystemModel,
        },
    

        // Repository
        {
            provide: "VendorInterface",
            useClass: VendorRepository,
        },
        {
            provide: "OwnerVendorInterface",
            useClass: OwnerVendorReferenceRepository,
        },
        {
            provide: "CompanyInterface",
            useClass: CompanyRepository,
        },
        {
            provide: "GeneralSystemInterface",
            useClass: GeneralSystemRepository,
        },


        //shared Services,
        VendorSharedService,


        // UseCases
        VendorMasterListUsecase,
        CreateUpdateVendorUsecase,
        VendorTypesUsecase,
        GetVendorOwnerMappingList,
        CreateUpdateVendorOwnerUsecase,
        VendorOwnerDetailsUsecase,
        GetVendorOwnerDropdown,
        GetVendorNumberConfigUsecase,
        VendorDetailsUsecase,
        GetAllVendorUseCase,
        DynamicModelInitializationRepository,
        DynamicTableOperations,
    ],
})
export class VendorManagementModule { }
