import { LogLevel } from "angular-auth-oidc-client";

export const googleConfig = {
    authority: 'https://accounts.google.com',
    clientId: 'client-id',
    redirectUrl: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug
};

export const facebookConfig = {
    authority: 'https://www.facebook.com',
    clientId: 'client-id',
    redirectUrl: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin,
    scope: 'email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    customParams: {
      fields: 'id,name,email,picture',
    },
};
