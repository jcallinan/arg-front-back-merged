import { Test, TestingModule } from "@nestjs/testing";
import { VendorManagementController } from "./vendor-management.controller";
import { VendorMasterListUsecase } from "../usecases/vendor-master-list/vendor-master-list.usecase";
import { CreateUpdateVendorUsecase } from "../usecases/create-and-update-vendor/create-and-update-vendor.usecase";
import { VendorTypesUsecase } from "../usecases/get-vendor-types/get-vendor-types.usecase";
import {
  vendorMasterListDto,
  vendorDetailsDto,
  vendorOwnerDto,
  vendorOwnerDetailsDto,
  vendorOwnerList,
  vendorDetailDto,
  vendorNextNoConfig,
} from "../dto/vendor-management.dto";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { VendorOwnerDetailsUsecase } from "../usecases/get-vendor-owner-details/get-vendor-owner-details.usecase";
import { CreateUpdateVendorOwnerUsecase } from "../usecases/create-and-update-owner-mapping/create-and-update-owner-mapping.usecase";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";
import { GetVendorOwnerMappingList } from "../usecases/get-vendor-owner-mapping-list/get-vendor-owner-mapping-list.usecase";
import { GetVendorOwnerDropdown } from "../usecases/get-vendor-owner-dropdown/get-vendor-owner-dropdown.usecase";
import { GetVendorNumberConfigUsecase } from "../usecases/get-vendor-no/get-vendor-no.usecase";
import { VendorDetailsUsecase } from "../usecases/get-vendor-details/get-vendor-details.usecase";
import { GetAllVendorUseCase } from "../usecases/get-vendor-list/get-vendor-list.usecase";
import { DropdownType } from "@src/types/types";
import { GetAllVendorsDto } from "../../voucher/dto/voucher.dto";
import { VendorFactory } from "@src/shared/tests";
import { IsDeletedStatus, VENDOR_STATUS } from "@src/shared/constants/constant";

describe("VendorManagementController", () => {
  let controller: VendorManagementController;
  let vendorTypesUsecase: VendorTypesUsecase;
  let vendorMasterListUsecase: VendorMasterListUsecase;
  let createUpdateVendorUsecase: CreateUpdateVendorUsecase;
  let createUpdateVendorOwnerUsecase: CreateUpdateVendorOwnerUsecase;
  let vendorOwnerDetailsUsecase: VendorOwnerDetailsUsecase;
  let getVendorOwnerMappingList: GetVendorOwnerMappingList;
  let getVendorOwnerDropdown: GetVendorOwnerDropdown;
  let getVendorNumberConfigUsecase: GetVendorNumberConfigUsecase;
  let vendorDetailsUsecase: VendorDetailsUsecase;
  let getAllVendorUseCase: GetAllVendorUseCase;

  // Base vendor fields for testing - only specify what's different from factory defaults
  const baseVendorFields = {
    vendorExpenseGLSub: 1234,
    vendorApTermsCode: 10,
    vendorAp1099Code: "T",
    vendorFirst1099BoxNumber: 1,
    vendorSecond1099BoxNumber: 2,
    vendorSecond1099BoxAmount: 50,
    vendorPayeeName1: "Test",
    vendorPayeeName2: "Test",
    vendorIrsNameControl: "T",
    vendorAdpPayrollId: 123,
    vendorAchClass: "A",
    vendorAchCheckingOrSavings: "C",
    vendorAchBankRoutingCode: 123456789,
    vendorAchBankAccountNumber: "Test",
    vendorFirstName: "Test",
    vendorMiddleName: "Test",
    vendorBusinessLastName: "Test",
    vendorNameSuffix: "Sr",
    vendorCountryCode: "US",
    vendorCategoryCode: "INA",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorManagementController],
      providers: [
        {
          provide: VendorTypesUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: VendorMasterListUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateUpdateVendorUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetVendorOwnerMappingList,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateUpdateVendorOwnerUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: VendorOwnerDetailsUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetVendorOwnerDropdown,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetVendorNumberConfigUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: VendorDetailsUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetAllVendorUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<VendorManagementController>(
      VendorManagementController
    );
    vendorTypesUsecase = module.get<VendorTypesUsecase>(VendorTypesUsecase);
    vendorMasterListUsecase = module.get<VendorMasterListUsecase>(
      VendorMasterListUsecase
    );
    createUpdateVendorUsecase = module.get<CreateUpdateVendorUsecase>(
      CreateUpdateVendorUsecase
    );
    createUpdateVendorOwnerUsecase = module.get<CreateUpdateVendorOwnerUsecase>(
      CreateUpdateVendorOwnerUsecase
    );
    vendorOwnerDetailsUsecase = module.get<VendorOwnerDetailsUsecase>(
      VendorOwnerDetailsUsecase
    );
    getVendorOwnerMappingList = module.get<GetVendorOwnerMappingList>(
      GetVendorOwnerMappingList
    );
    getVendorOwnerDropdown = module.get<GetVendorOwnerDropdown>(
      GetVendorOwnerDropdown
    );
    getVendorNumberConfigUsecase = module.get<GetVendorNumberConfigUsecase>(
      GetVendorNumberConfigUsecase
    );
    vendorDetailsUsecase =
      module.get<VendorDetailsUsecase>(VendorDetailsUsecase);
    getAllVendorUseCase = module.get<GetAllVendorUseCase>(GetAllVendorUseCase);
  });

  describe("getVendorTypes", () => {
    it("should return vendor types", async () => {
      const mockResult = ["Type1", "Type2"];
      jest.spyOn(vendorTypesUsecase, "execute").mockResolvedValue(mockResult);

      const result = await controller.getVendorTypes();
      expect(result).toEqual(mockResult);
      expect(vendorTypesUsecase.execute).toHaveBeenCalled();
    });
  });

  describe("getVendorMasterList", () => {
    it("should return paginated vendor list", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 1,
        items_per_page: 10,
      };

      const mockVendors = {
        items: [
          VendorFactory.createVendorForCompany(10, {
            vendorNo: 1000,
            vendorIsDeleted: VENDOR_STATUS.I,
            vendorTelephoneNo: 0,
            vendorLastPaymentAmt: 1634.38,
            vendorLastPaymentDate: 82313,
            vendorHoldPaymentsVend: "",
          }),
          VendorFactory.createVendorForCompany(10, {
            vendorNo: 1001,
            vendorIsDeleted: VENDOR_STATUS.A,
            vendorTelephoneNo: 3737368,
            vendorLastPaymentAmt: 1137.48,
            vendorLastPaymentDate: 81122,
            vendorHoldPaymentsVend: "",
          }),
        ],
        pagination: {
          total_items: 4000,
          current_page: 1,
          items_per_page: 500,
          total_pages: 30,
        },
      } as unknown as PaginatedResponse<Vendor>;

      jest
        .spyOn(vendorMasterListUsecase, "execute")
        .mockResolvedValue(mockVendors);

      const result = await controller.getVendorMasterList(dto);
      expect(result).toEqual(mockVendors);
      expect(vendorMasterListUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("addNewVendor", () => {
    it("should create or update a vendor", async () => {
      const dto: vendorDetailsDto = {
        vendorCompanyNumber: 10,
        vendorNo: 9875,
        vendorName: "Abhishek Consulting",
        vendorAdd1: "77 North Kendall",
        vendorAdd2: "Bradford, PA 16701",
        vendorAdd3: "Address",
        vendorAdd4: "Address",
        vendorZipCode: 4015,
        vendorTelephoneNo: 996,
        vendorHoldPaymentsVend: "A",
        vendorGalRcptsRequired: "T",
        vendorSingleCheck: "T",
        ...baseVendorFields,
        contactDetails: [
          VendorFactory.createVendorContactDetailDto({
            contactName: "Abhishek",
            emailAddress: "abhishek@amref.com",
          }),
          VendorFactory.createVendorContactDetailDto({
            contactName: "Adesh",
            emailAddress: "Adesh@amref.com",
          }),
          VendorFactory.createVendorContactDetailDto({
            contactName: "Disha",
            emailAddress: "disha@amref.com",
          }),
        ],
      };

      const mockResponse = { message: "Vendor Details saved successfully" };

      jest
        .spyOn(createUpdateVendorUsecase, "execute")
        .mockResolvedValue({ message: "Vendor Details saved successfully" });

      const result = await controller.addNewVendor(dto);
      expect(result).toEqual(mockResponse);
      expect(createUpdateVendorUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getOwnerMappingList", () => {
    it("should return paginated owner mapping list", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1444,
        status: "A",
        ownerNo: 2527,
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse = {
        items: [
          {
            items: [
              VendorFactory.createOwnerVendorMapping({
                ownerNo: 1,
                vendorNo: 1001,
                isDeleted: IsDeletedStatus.ACTIVE,
              }),
            ],
            total_items: 1,
            current_page: 1,
            items_per_page: 10,
            total_pages: 1,
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<{
        items: OwnerVendorEntity[];
        total_items: number;
        current_page: number;
        items_per_page: number;
        total_pages: number;
      }>;

      jest
        .spyOn(getVendorOwnerMappingList, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getOwnerMappingList(dto);
      expect(result).toEqual(mockResponse);
      expect(getVendorOwnerMappingList.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getOwnerDetails", () => {
    it("should return owner-vendor details", async () => {
      const dto: vendorOwnerDetailsDto = {
        vendorNo: 1001,
        ownerNo: 10,
      };

      const mockResponse = VendorFactory.createOwnerVendorMapping({
        ownerNo: 1,
        vendorNo: 1001,
        isDeleted: IsDeletedStatus.ACTIVE,
      });

      jest
        .spyOn(vendorOwnerDetailsUsecase, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getOwnerDetails(dto);
      expect(result).toEqual(mockResponse);
      expect(vendorOwnerDetailsUsecase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return null if no details found", async () => {
      const dto: vendorOwnerDetailsDto = {
        vendorNo: 9999,
        ownerNo: 10,
      };

      jest.spyOn(vendorOwnerDetailsUsecase, "execute").mockResolvedValue(null);

      const result = await controller.getOwnerDetails(dto);
      expect(result).toBeNull();
      expect(vendorOwnerDetailsUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("CreateAndUpdateOwner", () => {
    it("should create or update owner mapping", async () => {
      const dto: vendorOwnerDto = {
        ownerNo: 5,
        vendorNo: 1234,
        isDeleted: IsDeletedStatus.ACTIVE,
      };

      const mockResponse = { message: "Owner mapping saved successfully" };

      jest
        .spyOn(createUpdateVendorOwnerUsecase, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.CreateAndUpdateOwner(dto);
      expect(result).toEqual(mockResponse);
      expect(createUpdateVendorOwnerUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getVendorDetails", () => {
    it("should return vendor details", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1444,
      };

      const { vendor, vendorContactDetails } =
        VendorFactory.createVendorWithContacts(
          {
            vendorCompanyNumber: 10,
            vendorNo: 1444,
            vendorName: "Test Vendor",
            vendorAdd1: "Test Address",
            vendorAdd2: "Test City",
            vendorAdd3: "Test State",
            vendorAdd4: "Test Zip",
            vendorZipCode: 12345,
            vendorTelephoneNo: 1234567890,
            ...baseVendorFields,
          },
          {
            companyNo: 10,
            vendorNo: 1444,
            formType: "ABCY",
            sequenceNumber: 232577,
            contactName: "Test Contact",
            emailAddress: "test@example.com",
            sendAchEmail: "Y",
          }
        );

      const mockResponse = {
        vendor,
        vendorContactDetails,
      };

      jest
        .spyOn(vendorDetailsUsecase, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getVendorDetails(dto);
      expect(result).toEqual({
        items: mockResponse,
      });
      expect(vendorDetailsUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getOwnerNoList", () => {
    it("should return owner number dropdown list", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1444,
        status: "A",
        ownerNo: 2527,
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse: DropdownType[] = [
        { id: "1", value: "1", label: "Owner 1" },
        { id: "2", value: "2", label: "Owner 2" },
      ];

      jest
        .spyOn(getVendorOwnerDropdown, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getOwnerNoList(dto);
      expect(result).toEqual(mockResponse);
      expect(getVendorOwnerDropdown.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getNextVendorNoConfig", () => {
    it("should return next vendor number configuration", async () => {
      const dto: vendorNextNoConfig = {
        companyNo: 10,
      };

      const mockResponse = 1000;

      jest
        .spyOn(getVendorNumberConfigUsecase, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getNextVendorNoConfig(dto);
      expect(result).toEqual({
        items: mockResponse,
      });
      expect(getVendorNumberConfigUsecase.execute).toHaveBeenCalledWith(
        dto.companyNo
      );
    });
  });

  describe("getAllVendorsList", () => {
    it("should return paginated vendors list", async () => {
      const query: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      const mockItems = [
        VendorFactory.createVendorForCompany(10, {
          vendorNo: 1000,
          vendorName: "Test Vendor 1",
          vendorAdd1: "Test Address 1",
          vendorAdd2: "Test City 1",
          vendorAdd3: "Test State 1",
          vendorAdd4: "Test Zip 1",
          vendorZipCode: 12345,
          vendorTelephoneNo: 1234567890,
          ...baseVendorFields,
        }),
        VendorFactory.createVendorForCompany(10, {
          vendorNo: 1001,
          vendorName: "Test Vendor 2",
          vendorAdd1: "Test Address 2",
          vendorAdd2: "Test City 2",
          vendorAdd3: "Test State 2",
          vendorAdd4: "Test Zip 2",
          vendorZipCode: 12346,
          vendorTelephoneNo: 1234567891,
          ...baseVendorFields,
          vendorExpenseGLSub: 1235,
          vendorAdpPayrollId: 124,
          vendorAchBankRoutingCode: 123456790,
        }),
      ];

      const mockResponse = {
        items: mockItems,
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<Vendor>;

      jest
        .spyOn(getAllVendorUseCase, "execute")
        .mockResolvedValue(mockResponse);

      const result = await controller.getAllVendorsList(query);
      expect(result).toEqual({
        items: [
          { id: "1000", value: "Test Vendor 1", label: "Test Vendor 1" },
          { id: "1001", value: "Test Vendor 2", label: "Test Vendor 2" },
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      });
      expect(getAllVendorUseCase.execute).toHaveBeenCalledWith(query);
    });
  });
});
