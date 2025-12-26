import { ReportEntity } from "../../domain/entities/report.entity";
import { ProcessTypeModel } from "../models/process-type.model";

export function reportListMapper(record: ProcessTypeModel): ReportEntity {
    if (!record) {
        throw new Error("Report List record is null or undefined");
    }

    return ReportEntity.create({
        reportName: record.reportName,
        sharedReport: record.sharedReport,
        definitionName: record.definitionName,
        reportGroup: record.reportGroup,
        friendlyName: record.friendlyName,
        path: record.path,
    });
}
