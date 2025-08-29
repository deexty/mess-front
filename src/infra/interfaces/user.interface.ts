
export enum IUserType {
    ADMIN = 'admin',
    SYNDIC = 'syndic',
    OPERATOR = 'operator',
}

export interface IUser {
    id: string;
    phone: string;
    document: string;
    name: string;
    login: string;
    role: IUserType;
}

export interface ICreateUser {
    name: string;
    login: string;
    password: string;
    phone: string;
    document: string;
    role: IUserType;
}