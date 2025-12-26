import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions } from "@nestjs/swagger";

export const AuthCallback = {
    path: "/auth/callback",
    operation: {
        summary: "Set Cookie and Redirect",
        operationId: "callback",
        tags: ["auth"],
    } as ApiOperationOptions,
    queries: [
        {
            name: "code",
            type: String,
            required: false,
            description: "Microsoft Code",
        },
    ],
    response: {
        status: 200,
        description: "Paginated list of Reports Menu",
        schema: {
            type: "object",
            properties: {
                items: {
                    message: {
                        type: "Redirect",
                        example: "Redirect",
                    },
                },

            },
            required: ["items"],
        },
    } as ApiResponseOptions,
};

export const getToken = {
    path: "/auth/token",
    operation: {
        summary: "Get The Token",
        operationId: "getToken",
        tags: ["auth"],
    } as ApiOperationOptions,
    response: {
        status: 200,
        description: "Set the new Token",
        schema: {
            type: "object",
            properties: {
                items: {
                    message: {
                        type: "Redirect",
                        example: "Token is generated",
                    },
                },

            },
            required: ["items"],
        },
    } as ApiResponseOptions,
};

export const getUserDetails = {
    path: "/auth/me",
    operation: {
        summary: "Get User Details",
        operationId: "getUserDetails",
        tags: ["auth"],
    } as ApiOperationOptions,
    response: {
        status: 200,
        description: "Get the User Details",
        schema: {
            type: "object",
            properties: {
                items: {
                    email: {
                        type: "string",
                        example: "Email",
                    },
                    userDisplayName: {
                        type: "string",
                        example: "Kuldeep",
                    },
                    userInitials: {
                        type: "string",
                        example: "KS",
                    },
                },

            },
            required: ["items"],
        },
    } as ApiResponseOptions,
};

export const getLogout = {
    path: "/auth/logout",
    operation: {
        summary: "Logout User",
        operationId: "getLogout",
        tags: ["auth"],
    } as ApiOperationOptions,
    response: {
        status: 200,
        description: "Logout user",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Successfully logout",
                },
            },
            required: ["message"],
        },
    } as ApiResponseOptions,
};

export const validateUser = {
    path: "/auth",
    operation: {
        summary: "Authenticate and Authorize User",
        operationId: "validateUser",
        tags: ["auth"],
    } as ApiOperationOptions,
    body: {
        schema: {
            type: "object",
            required: ["authData"],
            properties: {
                authData: {
                    type: "object",
                    required: [
                        "route",
                    ],
                    properties: {
                        route: { type: "string", example: "N", required: false },
                        method: { type: "string", example: "N", required: false },
                        restApi: { type: "boolean", example: true, required: true },
                    },
                },
            },
        },
    } as ApiBodyOptions,
    response: {
        status: 200,
        description: "User Details",
        schema: {
            type: "object",
            properties: {
                items: {
                    email: {
                        type: "string",
                        example: "test@amref.com",
                    },
                    extensionAttribute1: {
                        type: "string",
                        example: "TEST",
                    },
                },

            },
            required: ["items"],
        },
    } as ApiResponseOptions,
};
