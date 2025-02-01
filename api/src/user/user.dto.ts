export class CreateUserDto {
    email: string;
    givenName?: string;
    familyName?: string;
    google_id?: string;
    facebook_id?: string;
}

export class UpdateUserDto {
    email?: string;
    givenName?: string;
    familyName?: string;
    google_id?: string;
    facebook_id?: string;
}
