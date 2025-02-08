import { TokenPayload } from "./TokenPayload";

export interface DecodedToken extends TokenPayload {
    iat: number;
    exp: number;
};
