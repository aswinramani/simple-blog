export const constants = {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    tokenType: "Bearer"
};

export enum ErrorTypes {
    TOKEN_EXPIRED = "token expired"
};

export enum APP_ROUTES {
    LOGIN = "login",
    AUTH_REDIRECT = "auth/redirect",
    POSTS = "posts",
    NEW_POSTS = "post/new",
    POST_ID = "post/:postId",
    REDIRECT = "/posts"
};
