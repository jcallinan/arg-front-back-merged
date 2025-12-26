import { TABLE_REGISTRY } from "@src/shared/config/constants/table-registry";
import { ModelConfig } from "@src/types/model.types";
import { UserModel } from "./user.model";
import { LoginHistoryModel } from "./login-histories.model";
import { GroupModel } from "./group.model";
import { RightsModel } from "./rights.model";
import { GroupRightsModel } from "./group-rights.model";
import { UsersGroupsMappingsModel } from "./user-group-mapping.model";
import { UsersRightsModel } from "./user-rights.model";
import { RouteMasterModel } from "./route-master.model";
import { RouteRightsMappingModel } from "./route-rights-mapping.model";
import { UserMetadataModel } from "./user-metadata.model";


export const AUTH_MODEL_CONFIGS: Record<string, ModelConfig> = {
  [UserModel.name]: {
    model: UserModel,
    schema: TABLE_REGISTRY.User.defaultSchema,
    tableName: TABLE_REGISTRY.User.name,
  },
  [UserMetadataModel.name]: {
    model: UserMetadataModel,
    schema: TABLE_REGISTRY.UserMetadata.defaultSchema,
    tableName: TABLE_REGISTRY.UserMetadata.name,
  },
  [LoginHistoryModel.name]: {
    model: LoginHistoryModel,
    schema: TABLE_REGISTRY.LoginHistory.defaultSchema,
    tableName: TABLE_REGISTRY.LoginHistory.name,
  },
  [RightsModel.name]: {
    model: RightsModel,
    schema: TABLE_REGISTRY.Rights.defaultSchema,
    tableName: TABLE_REGISTRY.Rights.name,
  },
  [GroupModel.name]: {
    model: GroupModel,
    schema: TABLE_REGISTRY.Group.defaultSchema,
    tableName: TABLE_REGISTRY.Group.name,
  },
  [GroupRightsModel.name]: {
    model: GroupRightsModel,
    schema: TABLE_REGISTRY.GroupRights.defaultSchema,
    tableName: TABLE_REGISTRY.GroupRights.name,
  },
  [UsersGroupsMappingsModel.name]: {
    model: UsersGroupsMappingsModel,
    schema: TABLE_REGISTRY.UsersGroupsMappings.defaultSchema,
    tableName: TABLE_REGISTRY.UsersGroupsMappings.name,
  },
  [UsersRightsModel.name]: {
    model: UsersRightsModel,
    schema: TABLE_REGISTRY.UsersRights.defaultSchema,
    tableName: TABLE_REGISTRY.UsersRights.name,
  },
  [RouteMasterModel.name]: {
    model: RouteMasterModel,
    schema: TABLE_REGISTRY.RouteMaster.defaultSchema,
    tableName: TABLE_REGISTRY.RouteMaster.name,
  },
  [RouteRightsMappingModel.name]: {
    model: RouteRightsMappingModel,
    schema: TABLE_REGISTRY.RouteRightsMapping.defaultSchema,
    tableName: TABLE_REGISTRY.RouteRightsMapping.name,
  },
};

