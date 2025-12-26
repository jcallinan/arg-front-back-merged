export interface LoginHistoryInterface {
    
    deactivateUserSessions(userId: number): Promise<number>;

    create(data: any): Promise<any>;
}
