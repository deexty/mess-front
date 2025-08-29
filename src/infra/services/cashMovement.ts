import { AxiosResponse } from "axios";
import { ICreateCashMovement, ICashMovement } from "../interfaces/cashMovement.interface";
import { api } from "./api";

export interface ICashMovementsResponse {
    result: ICashMovement[]
    total: number
}


const create = async (data: ICreateCashMovement): Promise<AxiosResponse<ICashMovement>> => await api.post("/cash-movements", data);
const update = async (data: ICreateCashMovement, id: string): Promise<AxiosResponse<ICashMovement>> => await api.put(`/cash-movements/${id}`, data);
const getAll = async (query?: string): Promise<AxiosResponse<ICashMovementsResponse>> => await api.get(`/cash-movements${query}`);
const getOne = async (id: string): Promise<AxiosResponse<ICashMovement>> => await api.get(`/cash-movements/${id}`);
const remove = async (id: string): Promise<AxiosResponse<ICashMovement>> => await api.delete(`/cash-movements/${id}`);


export const cashMovementService = {
    getAll,
    create,
    update,
    remove,
    getOne
} 