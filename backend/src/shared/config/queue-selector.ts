import { BadRequestException } from "@nestjs/common";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { QUEUE_NAMES } from "@src/shared/constants/constant";

export class QueueSelector {
  constructor() {}

  /**
   * Used by bullmq FlowProducer to specify the string queue name.
   */
  getQueueName(processType: ProcessType): string {
    switch (processType) {
      case ProcessType.FLEXI:
        return QUEUE_NAMES.FLEXI;
      case ProcessType.SOGAS:
        return QUEUE_NAMES.SOGAS;
      case ProcessType.PAPER:
        return QUEUE_NAMES.PAPER;
      case ProcessType.CLEAR_CHECKS:
        return QUEUE_NAMES.CLEAR_CHECKS;
      default:
        throw new BadRequestException(
          `Unsupported process type: ${processType}`
        );
    }
  }
}
