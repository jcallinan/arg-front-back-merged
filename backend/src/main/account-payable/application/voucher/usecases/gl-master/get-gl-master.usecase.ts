import { Injectable} from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { GetGlMasterDto } from "../../dto/voucher.dto";

@Injectable()
export class GetGlMasterUseCase {
  private readonly logger = new AppLogger(GetGlMasterUseCase.name);

  constructor(
    private readonly glMasterService: GlMasterService,
  ) {}

  async execute(dto: GetGlMasterDto): Promise<any> {
    
    this.logger.log(`Fetching GL master details for company ${dto.companyNo} and GL ${dto.glNo}`);
      
      const glNoStr = dto.glNo.toString().padStart(8, '0');
      const accountNo = parseInt(glNoStr.substring(0, 6));
      const subAccountNo = parseInt(glNoStr.substring(6));

      const glRecord = await this.glMasterService.getGlMasterRecord(
        dto.companyNo,
        accountNo,
        subAccountNo,
        'C',
        false,
      );
      
      return glRecord;
  }
} 