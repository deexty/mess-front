import { IContract } from "./contract.interface";

export enum CashMovementStatusEnum {
    PREDICTED = 'predicted',
    LATE = 'late',
    PAYED = 'payed',
}


export interface ICashMovement {
    id: string
    contract_id: string;
    reference_date: Date;
    amount: number;
    status: CashMovementStatusEnum;
    contract?: IContract;
}


export interface ICreateCashMovement {
    contract_id: string;
    reference_date: Date;
    amount: number;
    status: CashMovementStatusEnum;
}