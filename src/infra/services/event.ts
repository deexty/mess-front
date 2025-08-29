import { AxiosResponse } from "axios";
import { api } from "./api";
import { ICreateEvent, IEvent } from "../interfaces/event.interface";

export interface IEventsResponse {
    result: IEvent[]
    total: number
}


const create = async (data: ICreateEvent): Promise<AxiosResponse<IEvent>> => await api.post("/events", data);
const update = async (data: ICreateEvent, id: string): Promise<AxiosResponse<IEvent>> => await api.put(`/events/${id}`, data);
const getAll = async (query?: string): Promise<AxiosResponse<IEventsResponse>> => await api.get(`/events${query}`);
const getOne = async (id: string): Promise<AxiosResponse<IEvent>> => await api.get(`/events/${id}`);
const remove = async (id: string): Promise<AxiosResponse<IEvent>> => await api.delete(`/events/${id}`);


export const eventService = {
    getAll,
    create,
    update,
    remove,
    getOne
} 