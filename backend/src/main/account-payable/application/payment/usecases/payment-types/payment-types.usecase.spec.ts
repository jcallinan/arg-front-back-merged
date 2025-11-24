import { PaymentTypesUseCase } from "./payment-types.usecase";
import { PAYMENT_VOUCHER_TYPE_DROPDOWN } from "@src/shared/constants/payment-constant";

describe("PaymentTypesUseCase", () => {
  it("execute should return voucher type dropdown (Check/ACH/Wire)", async () => {
    const usecase = new PaymentTypesUseCase();
    const result = await usecase.execute();
    expect(result).toEqual(PAYMENT_VOUCHER_TYPE_DROPDOWN);
  });
});


