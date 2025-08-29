export interface IContract {
    id: string
    condominium_id: string;
    unit_qtd: number;
    month_value: number;
    expiration_date: Date;
    comission: number;
}

export interface ICreateContract {
    condominium_id: string;
    unit_qtd: number;
    month_value: number;
    expiration_date: Date;
    comission: number;
}
