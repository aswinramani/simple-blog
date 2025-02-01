export interface ProfileNames {
    givenName: string;
    familyName: string;
};

export interface UserProfile {
    providerUserId: string,
    provider: string,
    profile: ProfileNames,
    email: string,
    accessToken?: string
};
