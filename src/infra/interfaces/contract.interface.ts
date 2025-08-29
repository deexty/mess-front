import { ICondominium } from "./condominium.interface";

export interface IContract {
    id: string
    name: string
    condominium_id: string;
    unit_qtd: number;
    month_value: number;
    expiration_date: Date;
    comission: number;
    condominium?: ICondominium
}

export interface ICreateContract {
    condominium_id: string;
    name: string
    unit_qtd: number;
    month_value: number;
    expiration_date: Date;
    comission: number;
}
