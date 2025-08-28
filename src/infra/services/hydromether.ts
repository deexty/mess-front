import { AxiosResponse } from "axios";
import { api } from "./api";
import { ICreateHydrometer, IHydrometer } from "../interfaces/hydrometer.interface";
import { ICreateReading, IReading } from "../interfaces/reading.interface";


export interface IHydrometersResponse {
    result: IHydrometer[]
    total: number
}

const getAll = (query: string): Promise<AxiosResponse<IHydrometersResponse>> => {
    return api.get(`/hydrometer${query}`);
};
const create = async (data: ICreateHydrometer): Promise<AxiosResponse<IHydrometer>> => await api.post("/hydrometer", data);
const update = async (data: ICreateHydrometer, id: string): Promise<AxiosResponse<IHydrometer>> => await api.put(`/hydrometer/${id}`, data);
const remove = async (id: string): Promise<AxiosResponse<IHydrometer>> => await api.delete(`/hydrometer/${id}`);
const createReading = async (data: FormData): Promise<AxiosResponse<IReading>> => await api.post("hydrometer/readings", data, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});

export const hydrometerService = {
    getAll,
    create,
    remove,
    update,
    createReading
} 