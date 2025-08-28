export interface ICondominium {
    id: number;
    corporate_name: string;
    trade_name: string;
    cnpj: string;
    units?: number;
    complement?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    reference?: string;
    syndic_id: number;
}

export interface ICreateCondominium {
    corporate_name: string;
    trade_name: string;
    cnpj: string;
    units?: number;
    complement?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    reference?: string;
    syndic_id: number;
}
