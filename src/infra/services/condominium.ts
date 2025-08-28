import { AxiosResponse } from "axios";
import { ICondominium, ICreateCondominium } from "../interfaces/condominium.interface";
import { api } from "./api";

export interface ICondominiumsResponse {
    result: ICondominium[]
    total: number
}

const create = async (data: ICreateCondominium): Promise<AxiosResponse<ICondominium>> => await api.post("/condominium", data);
const update = async (data: ICreateCondominium, id: string): Promise<AxiosResponse<ICondominium>> => await api.put(`/condominium/${id}`, data);
const getAll = async (query?: string): Promise<AxiosResponse<ICondominiumsResponse>> => await api.get(`/condominium${query}`);
const getOne = async (id: string): Promise<AxiosResponse<ICondominium>> => await api.get(`/condominium/${id}`);
const remove = async (id: string): Promise<AxiosResponse<ICondominium>> => await api.delete(`/condominium/${id}`);

export const condominiumService = {
    create,
    getAll,
    update,
    remove,
    getOne
}