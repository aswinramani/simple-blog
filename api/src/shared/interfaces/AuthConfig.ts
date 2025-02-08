interface AuthConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
};

export interface GoogleConfig extends AuthConfig {
    scope: string[];
};

export interface FaceBookConfig extends AuthConfig {
    profileFields: string[];
}
