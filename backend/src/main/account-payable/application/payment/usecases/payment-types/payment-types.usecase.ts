import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { DropdownOption } from "@src/shared/utils/response-formatter";
import { PAYMENT_VOUCHER_TYPE_DROPDOWN } from "@src/shared/constants/payment-constant";

@Injectable()
export class PaymentTypesUseCase {
  private readonly logger = new AppLogger(PaymentTypesUseCase.name);

  constructor() {}

  async execute(): Promise<DropdownOption[]> {
    this.logger.log(
      `Fetching all voucher payment types ${JSON.stringify(PAYMENT_VOUCHER_TYPE_DROPDOWN)}`
    );
    return PAYMENT_VOUCHER_TYPE_DROPDOWN;
  }
}
