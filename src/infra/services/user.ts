import { AxiosResponse } from "axios";
import { IUser } from "../interfaces/user.interface";
import { api } from "./api";

export interface IUsersResponse {
    result: IUser[]
    total: number
}

const getAll = (query: string): Promise<AxiosResponse<IUsersResponse>> => {
    return api.get(`/users${query}`);
};

export const userService = {
    getAll
} 