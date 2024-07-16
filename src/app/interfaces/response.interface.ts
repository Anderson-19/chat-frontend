import { User } from "./user.interface";

export interface ResponseGeneric {
    status: number,
    message: any,
    error: boolean,
    data?: {
        token: string,
        user: User
    },
}
