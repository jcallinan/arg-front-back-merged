import { Injectable, Inject } from "@nestjs/common";
import { Op, where, col, literal, fn } from "@sequelize/core"
import { AppLogger } from "@src/shared/logger/logger.service";
import { EmployeeExpenseInterface } from "../../domain/interface/employee-expense.interface";
import { OpenPayableHeaderModel } from "../models/open-payable-header.model";
import { OpenPayableDetailsModel } from "../models/open-payable-details.model";
import { VendorModel } from "../models/vendor.model";
import { generateReportType } from "@src/types/employee-expense-types";
import { flattenObject } from "@src/shared/utils/object.utils";
import { convertMMDDYYtoYYYYMMDD } from "@src/shared/utils/format-date";

@Injectable()
export class EmployeeExpenseRepository implements EmployeeExpenseInterface {

    private readonly logger = new AppLogger(EmployeeExpenseRepository.name);

    constructor(

        @Inject("OpenPayableDetailsModel")
        private readonly openPayableDetailsModel: typeof OpenPayableDetailsModel,

        @Inject("OpenPayableHeaderModel")
        private readonly openPayableHeaderModel: typeof OpenPayableHeaderModel,

        @Inject("VendorModel")
        private readonly vendorModel: typeof VendorModel,

    ) { }



    async generateDetailReport(data: generateReportType) {

        try {
            const { bankGlNo, dateToPay } = data

            const formatDate = convertMMDDYYtoYYYYMMDD(dateToPay)

            this.logger.log(`Generate the Summary Report for the Summary Report dateToPay:${formatDate}`)

            const results = await this.openPayableHeaderModel.findAll({
                where: {
                    bankGlNo,
                    dueDate8: { [Op.lte]: formatDate },
                    holdPaymentFlag: 'E',
                    isDeleted: { [Op.ne]: 'D' },
                },
                attributes: [
                    "voucherNo", "vendorNo", "dueDate8", [literal(`'TBD'`), "PaymentAmount"],
                ],
                include: [
                    {
                        model: this.vendorModel,
                        as: 'vendorDetail',
                        required: true,
                        attributes: ["vendorName", "vendorAdpPayrollId"],
                    },
                    {
                        model: this.openPayableDetailsModel,
                        as: 'voucherDetails',
                        required: true,
                        on: {
                            [Op.and]: [
                                where(col(`OpenPayableHeaderModel.${(this.openPayableHeaderModel as any).getAttributes().vendorNo.field}`), Op.eq,
                                    col(`voucherDetails.${(this.openPayableDetailsModel as any).getAttributes().vendorNo.field}`)),
                                where(col(`OpenPayableHeaderModel.${(this.openPayableHeaderModel as any).getAttributes().companyNo.field}`), Op.eq,
                                    col(`voucherDetails.${(this.openPayableDetailsModel as any).getAttributes().companyNo.field}`)),
                                where(col(`OpenPayableHeaderModel.${(this.openPayableHeaderModel as any).getAttributes().vendorNo.field}`), Op.eq,
                                    col(`voucherDetails.${(this.openPayableDetailsModel as any).getAttributes().vendorNo.field}`)),
                                where(col(`OpenPayableHeaderModel.${(this.openPayableHeaderModel as any).getAttributes().voucherNo.field}`), Op.eq,
                                    col(`voucherDetails.${(this.openPayableDetailsModel as any).getAttributes().voucherNo.field}`)),
                            ],
                        },
                        attributes: ["lineDescription", "grossAmount", "vendorNo"],
                    },
                ],
                order: [[literal(`"${(this.vendorModel as any).getAttributes().vendorAdpPayrollId.field}"`), 'ASC']],
            });

            if (results.length) {

                const rows = results.map(r => flattenObject(r.get({ plain: true })));

                return rows.map(item => ({
                    VNName: item.VendorName?.trim(),
                    OPLNDS: item.LineDescription?.trim(),
                    OPGRAM: item.GrossAmount,
                    PaymentAmount: item.PaymentAmount,
                    OPDUE8: item.DueDate8,
                    ONVONO: item.VoucherNo,
                    VNPRID: item.VendorAdpPayrollId,   // note: no spaces in the key
                    OPVEND: item.VendorNo,
                }));
            }

            return []

        } catch (error) {
            this.logger.error(
                `Failed to fetch data for Summary Report for Employee Expense: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            throw error
        }
    }

    async generateSummaryReport(data: generateReportType) {

        try {
            const { bankGlNo, dateToPay } = data

            const formatDate = convertMMDDYYtoYYYYMMDD(dateToPay)
            this.logger.log(`Generate the Detailed Report for Employee Expense bankGlNo: ${bankGlNo}`)

            const vendorNoCol = (this.openPayableHeaderModel as any).getAttributes().vendorNo.field;
            const grossAmtCol = (this.openPayableHeaderModel as any).getAttributes().grossAmount.field;
            const vendorAdpCol = (this.vendorModel as any).getAttributes().vendorAdpPayrollId.field;

            const result = await this.openPayableHeaderModel.findAll({
                attributes: [
                    [fn('SUM', literal(`"${grossAmtCol}"`)), 'ExpenseAmount'],
                    [literal(`"${vendorNoCol}"`), 'vendorNo'],
                ],
                where: {
                    bankGlNo,
                    holdPaymentFlag: 'E',
                    isDeleted: { [Op.ne]: 'D' },
                    dueDate8: { [Op.lte]: formatDate },
                },
                include: [
                    {
                        model: this.vendorModel,
                        as: "vendorDetail",
                        required: true,
                        attributes: ['vendorAdpPayrollId']
                    },
                ],
                group: [
                    literal(`"vendorDetail"."${vendorAdpCol}"`),
                    literal(`"${vendorNoCol}"`),
                ],
                order: [[literal(`"${vendorNoCol}"`), 'ASC']],
                raw: true,
                logging: console.log,
            });


            if (result.length) {

                // return result
                result.map((details) => flattenObject(details))

                return result.map(item => ({
                    VendorID: item.vendorNo,
                    ADP_Payroll_ID: item["vendorDetail.vendorAdpPayrollId"],
                    ExpenseAmount: item.ExpenseAmount
                }));
            }

            return []

        } catch (error) {
            this.logger.error(
                `Failed to fetch data for Detailed Report for Employee Expense: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            throw error
        }
    }

    async generateReport(data: generateReportType) {

        try {
            // Fetch the Data from the DB
            this.logger.log("Fetch the Data from the DB")

            const detailedReport = await this.generateDetailReport(data)

            const summaryReport = await this.generateSummaryReport(data)

            this.logger.log(`Detailed Report: ${JSON.stringify(detailedReport)}, SummaryReport:${JSON.stringify(summaryReport)}`)

            return { detailedReport, summaryReport }

        } catch (error) {
            this.logger.error(
                `Failed to fetch data for Employee Expense Reports: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            throw error
        }
    }

}
