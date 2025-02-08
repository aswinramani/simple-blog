import { ProfileNames } from "./ProfileNames";

export interface UserProfile {
    providerUserId: string,
    provider: string,
    profile: ProfileNames,
    email: string,
    accessToken?: string
};
