export const TABLE_REGISTRY = {
  User: {
    name: "User",
    description: "User",
    defaultSchema: "dataLib",
  },
  UserMetadata: {
    name: "UserMetadata",
    description: "UserMetadata",
    defaultSchema: "dataLib",
  },
  Group: {
    name: "Group",
    description: "Group",
    defaultSchema: "dataLib",
  },
  Rights: {
    name: "Rights",
    description: "Rights",
    defaultSchema: "dataLib",
  },
  GroupRights: {
    name: "GroupRights",
    description: "GroupRights",
    defaultSchema: "dataLib",
  },
  UsersGroupsMappings: {
    name: "UsersGroupsMappings",
    description: "UsersGroupsMappings",
    defaultSchema: "dataLib",
  },
  UsersRights: {
    name: "UsersRights",
    description: "UsersRights",
    defaultSchema: "dataLib",
  },
  LoginHistory: {
    name: "LoginHistory",
    description: "LoginHistory",
    defaultSchema: "dataLib",
  },
  RouteMaster: {
    name: "RouteMaster",
    description: "RouteMaster",
    defaultSchema: "dataLib",
  },
  RouteRightsMapping: {
    name: "RouteRightsMapping",
    description: "RouteRightsMapping",
    defaultSchema: "dataLib",
  },
} as const;

export type TableName = keyof typeof TABLE_REGISTRY;
