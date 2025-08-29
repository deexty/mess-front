import { AxiosResponse } from "axios";
import { ICreateUser, IUser } from "../interfaces/user.interface";
import { api } from "./api";

export interface IUsersResponse {
    result: IUser[]
    total: number
}


const create = async (data: ICreateUser): Promise<AxiosResponse<IUser>> => await api.post("/users", data);
const update = async (data: ICreateUser, id: string): Promise<AxiosResponse<IUser>> => await api.put(`/users/${id}`, data);
const getAll = async (query?: string): Promise<AxiosResponse<IUsersResponse>> => await api.get(`/users${query}`);
const getOne = async (id: string): Promise<AxiosResponse<IUser>> => await api.get(`/users/${id}`);
const remove = async (id: string): Promise<AxiosResponse<IUser>> => await api.delete(`/users/${id}`);


export const userService = {
    getAll,
    create,
    update,
    remove,
    getOne
} 