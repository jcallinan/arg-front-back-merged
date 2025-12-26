import { LoginHistoryModel } from "./models/login-histories.model";
import { UsersGroupsMappingsModel } from "./models/user-group-mapping.model";
import { UserModel } from "./models/user.model";
import { LoginHistoryRepository } from "./repositories/login-history.repository";
import { UserRepository } from "./repositories/user.repository";
import { UsersGroupsMappingsRepository } from "./repositories/users-groups-mappings..repository";
import { UserMetadataModel } from "./models/user-metadata.model";


// User providers
export const userProviders = [
    {
        provide: "UserModel",
        useValue: UserModel,
    },
    {
        provide: "UserInterface",
        useClass: UserRepository,
    },
];

export const loginHistoryProviders = [
   
    {
        provide: "LoginHistoryModel",
        useValue: LoginHistoryModel,
    },
    {
        provide: "LoginHistoryInterface",
        useClass: LoginHistoryRepository,
    },
];

export const usersGroupsMappingsProviders = [
    {
        provide: "UsersGroupsMappingsModel",
        useValue: UsersGroupsMappingsModel,
    },
    {
        provide: "UsersGroupsMappingsInterface",
        useClass: UsersGroupsMappingsRepository,
    },
];

export const userMetadataProviders = [
    {
        provide: "UserMetadataModel",
        useValue: UserMetadataModel,
    },
];


// All data providers
export const allDataProviders = [
    ...userProviders,
    ...loginHistoryProviders,
    ...usersGroupsMappingsProviders,
    ...userMetadataProviders,
];
