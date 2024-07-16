export interface User {
    _id?: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    password?: string;
    isActive: boolean;
    about: string;
    avatar: string;
    createdAt?: string;
    updatedAt?: string;
}
