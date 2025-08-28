
export interface IHydrometer {
    id: string;
    condominium_id: string;
    identifier: string;
    red_digits: string;
    black_digits: string;
    reference: string;
}

export interface ICreateHydrometer {
    condominium_id: string;
    identifier: string;
    red_digits: string;
    black_digits: string;
    reference: string;
}