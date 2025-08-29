import { AxiosResponse } from "axios";
import { api } from "./api";
import { IContract, ICreateContract } from "../interfaces/contract.interface";

export interface IContractsResponse {
    result: IContract[]
    total: number
}


const create = async (data: ICreateContract): Promise<AxiosResponse<IContract>> => await api.post("/contracts", data);
const update = async (data: ICreateContract, id: string): Promise<AxiosResponse<IContract>> => await api.put(`/contracts/${id}`, data);
const getAll = async (query?: string): Promise<AxiosResponse<IContractsResponse>> => await api.get(`/contracts${query}`);
const getOne = async (id: string): Promise<AxiosResponse<IContract>> => await api.get(`/contracts/${id}`);
const remove = async (id: string): Promise<AxiosResponse<IContract>> => await api.delete(`/contracts/${id}`);


export const contractService = {
    getAll,
    create,
    update,
    remove,
    getOne
} 