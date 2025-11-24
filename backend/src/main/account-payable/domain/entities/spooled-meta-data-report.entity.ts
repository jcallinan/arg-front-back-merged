export class SpooledMetaDataReportEntity {
    constructor(
        public pdfFileName: string,
        public spoolFileName: string,
        public reportType: string,
        public jobName: string,
        public jobNumber: Number,
        public jobUser: string,
        public jobSystemName: string,
        public filePath: string,
        public outputQueueName: string,
        public outputQueueLibrary: string,
        public reportDateTime: Date,
        public formType: string,
        public error: string,
    ) { }
}
