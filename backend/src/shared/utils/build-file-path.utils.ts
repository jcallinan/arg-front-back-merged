export function buildFilePath(fileName: string): string {
    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'uat' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
        return `${process.env.FILE_PROTOCOL ?? 'https'}://${process.env.APP_SERVER_IP ?? 'qa-app-damco.amref.com'}:${process.env.FILE_EXTERNAL_PORT || 5443}${process.env.FILE_SERVE_ROOT ?? '/G-Drive'}/${fileName}`;
    }
    const basePath = `http://${process.env.APP_SERVER_IP ?? '172.16.30.10'}:${process.env.PORT ?? 5001}${process.env.FILE_SERVE_ROOT ?? '/G-Drive'}`;
 
    return `${basePath}/${fileName}`;
}