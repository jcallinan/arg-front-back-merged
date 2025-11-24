export class ReportEntity {
    reportName!: string;
    sharedReport!: string;
    definitionName!: string;
    reportGroup!: string;
    friendlyName!: string;
    path!: string


    constructor(partial: Partial<ReportEntity>) {
        Object.assign(this, partial);
    }

    static create(partial: Partial<ReportEntity>): ReportEntity {
        return new ReportEntity(partial);
    }



}
