export const constants = {
    port: 'port',
    host: 'host',
    googleClientId: 'googleClientId',
    googleClientSecret: 'googleClientSecret',
    googleCallBackPath: 'googleCallBackPath',
    googleScopes: 'googleScopes',
    GOOGLE_CONFIG: 'GOOGLE_CONFIG',
    google: 'google',
    facebookAppId: 'facebookAppId',
    facebookAppSecret: 'facebookAppSecret',
    facebookCallBackPath: 'facebookCallBackPath',
    facebookScopes: 'facebookScopes',
    FACEBOOK_CONFIG: 'FACEBOOK_CONFIG',
    facebook: 'facebook',
    token: 'token',
    tokenExpiry: 'tokenExpiry',
    refreshToken: 'refreshToken',
    refreshTokenExpiry: 'refreshTokenExpiry',
    DATA_SOURCE: 'DATA_SOURCE',
    dbType: 'dbType',
    dbHost: 'dbHost',
    dbPort: 'dbPort',
    dbUserName: 'dbUserName',
    dbPassword: 'dbPassword',
    dbDefault: 'dbDefault',
    dbName: 'dbName',
    dbSync: 'dbSync',
    dbMigrationsRun: 'dbMigrationsRun',
    dbMinPool: 'dbMinPool',
    dbMaxPool: 'dbMaxPool',
    dbIdleTimeout: 'dbIdleTimeout',
    allowedOrigins: 'allowedOrigins',
    USER_REPOSITORY: 'USER_REPOSITORY',
    POST_REPOSITORY: 'POST_REPOSITORY',
    prefix: 'prefix'
};

export const AUTH_ROUTES = {
    BASE: "auth",
    GOOGLE_CALLBACK: "google/callback",
    FACEBOOK_CALLBACK: "facebook/callback",
    REFRESH: "refresh"
};

export const POST_ROUTES = {
    BASE: "posts",
    COUNT: "count",
    ID: "/:id",
};

export enum ErrorTypes {
    UNAUTHORIZED = "Unauthorized",
    TOKEN_EXPIRED = "Token expired",
    INVALID_TOKEN = "Invalid token"
};

export const mockValues = {
    state: "https://blogger.dev",
};
