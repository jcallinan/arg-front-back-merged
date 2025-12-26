import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { formatCurrency } from "@src/shared/utils/currency.utils";
import { WebsocketGateway } from "./websocket.gateway";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { webSocketResponse } from "@src/shared/utils/response-formatter";
import { UserContext } from "@src/shared/utils/user-context";
@Injectable()
export class WebsocketService {
  private readonly logger = new AppLogger(WebsocketService.name);
  constructor(private readonly gateway: WebsocketGateway) {}

  // 🔹 keep broadcast backwards compatible
  emitUploadStatus(event: string, data: any) {
    this.gateway.emitEvent(event, data);
    this.logger.log(`Emitting event: ${event} with ${data}`);
  }

  // 🔹 new: user-specific emit
  emitUploadStatusToUser(userInitials: string, event: string, data: any) {
    this.gateway.emitToUser(userInitials, event, data);
    this.logger.log(`User-specific event: ${event} to user=${userInitials}`);
  }

  async emitFinalSummaryToWebSocket(uploadId: string, summariesObj: any) {
    const userInitials = UserContext.userInitials();
    if (!userInitials) {
      this.logger.warn("No UserContext available");
      return;
    }
    const payload = this.prepareSummaryPayload(uploadId, summariesObj);
    this.logger.log(
      `Upload summary for user=${userInitials}: ${JSON.stringify(payload)}`
    );
    this.emitUploadStatusToUser(userInitials, 'upload-status', payload);
  }

  private calculateProcessSummary(
    summaries: {
      status: string | null;
      checkAmount?: number;
      invoiceAmount?: number;
    }[]
  ): {
    totalAmount: string;
    countE: number;
    countW: number;
    countS: number;
    totalUploads: number;
  } {
    let totalAmount = 0;
    let countS = 0,
      countE = 0,
      countW = 0;

    for (const entry of summaries) {
      const status = (entry.status || "").trim();

      if (status === VOUCHER_STATUS_CODES.S) {
        countS++;
      } else if (status === VOUCHER_STATUS_CODES.E) {
        countE++;
      } else if (status === VOUCHER_STATUS_CODES.W) {
        countW++;
      }
      // Handle both checkAmount (for Clear Checks) and invoiceAmount (for vouchers)
      totalAmount += Number(entry.checkAmount || entry.invoiceAmount) || 0;
    }

    return {
      totalAmount: formatCurrency(totalAmount, "USD", "en-US"),
      countE,
      countW,
      countS,
      totalUploads: countE + countW + countS,
    };
  }
  

  async emitBatchSummaryToWebSocket(
    batchId: string,
    summariesObj: any,
    event: string
  ) {
    const userInitials = UserContext.userInitials();
    if (!userInitials) {
      this.logger.warn("No UserContext available");
      return;
    }
    const items = Object.values(summariesObj).flatMap((json) =>
      typeof json === "string" ? JSON.parse(json) : []
    );
    const summary = this.calculateProcessSummary(items);

    const payload = await webSocketResponse({ id: batchId, summary, items });

    this.logger.log(
      `Emitting batch summary payload: ${JSON.stringify(payload)}`
    );
   
    this.emitUploadStatusToUser(userInitials, event, payload);
  }

  // --- helpers ---
  private prepareSummaryPayload(uploadId: string, summariesObj: any) {
    const items = Object.values(summariesObj).flatMap((json) =>
      typeof json === 'string' ? JSON.parse(json) : []
    );
    const allUnprocessed = items.flatMap((i: any) => i._unprocessedItems || []);
    const cleanItems = items.map(({ _unprocessedItems, ...i }) => i);
    const summary = this.calculateProcessSummary(cleanItems);

    return webSocketResponse({
      id: uploadId,
      summary,
      items: cleanItems,
      unprocessedItems: allUnprocessed.length > 0 ? allUnprocessed : undefined,
    });
  }
}
