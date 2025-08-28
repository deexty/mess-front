
export enum IUserType {
    ADMIN = 'admin',
    SYNDIC = 'syndic',
    OPERATOR = 'operator',
}

export interface IUser {
    id: number;
    name: string;
    login: string;
    type: IUserType;
}