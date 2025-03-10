import { LogLevel } from "angular-auth-oidc-client";
import { env } from '../environments/environment';

export const googleConfig = {
    authority: env.googleAuthority,
    clientId: env.googleClientId,
    redirectUrl: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin,
    scope: env.googleScopes,
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug
};

export const facebookConfig = {
    authority: env.facebookAuthority,
    clientId: env.facebookAppId,
    redirectUrl: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin,
    scope: env.facebookScopes,
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    customParams: {
      fields: 'id,name,email,picture',
    },
};
