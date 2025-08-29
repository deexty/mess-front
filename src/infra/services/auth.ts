import { AxiosResponse } from "axios";
import { api } from "./api";
import { ICreateUser } from "../interfaces/user.interface";


export interface ILogin {
    login: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        login: string;
        created_at: string;
        updated_at: string;
    }
}


const path = 'auth'

const login = async (values: ILogin): Promise<AxiosResponse<IAuthResponse>> => await api.post(`${path}/login`, values)
const register = async (values: ICreateUser): Promise<AxiosResponse<IAuthResponse>> => await api.post(`${path}/register`, values)

export const authService = {
    login,
    register
}