import { Injectable } from "@nestjs/common";
import { SubmitPurchaseJournalDto } from "../../dto/purchase-journal.dto";
import { AppLogger } from "@src/shared/logger/logger.service";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";

@Injectable()
export class PurchaseJournalSubmitUseCase {
  private readonly logger = new AppLogger(PurchaseJournalSubmitUseCase.name);

  constructor(
    private readonly purchaseJournalService: PurchaseJournalService
  ) {}

  async execute(dto: SubmitPurchaseJournalDto) {
    this.logger.log("Submitting Purchase Journal");
    const result = await this.purchaseJournalService.submitPurchaseJournal(dto);
    return result;
  }
}
