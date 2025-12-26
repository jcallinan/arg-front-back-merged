import { UserEntity } from "../entities/user.entity"


export interface UserInterface {
    findOne(data: { Email: string })

    findByEmailAndRefresh(RefreshToken: string)

    createOrUpdate(data: any)

    navigationDetails(userId: number)

    getUserRights(userId: number): Promise<{rights: String[], formattedRights: { [key: string]: { path: string } }}>
    
    refreshUserCache(userId: number): Promise<{message: string}>

    clearUserCache(user: UserEntity): Promise<{message: string}>
}
