"use client";

import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { ICashMovement } from "../interfaces/cashMovement.interface";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/ParseFilters";
import { ICashMovementsResponse, cashMovementService } from "../services/cashMovement";

interface ICashMovementResponseHook {
    cashMovements: ICashMovement[] | [];
    cashMovementsLoading: boolean;
    cashMovementsRefresh: VoidFunction;
    cashMovementsTotal: number;
}

export const useCashMovements = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): ICashMovementResponseHook => {
    const [data, setData] = useState<ICashMovement[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData = () => {
        if (loading) return;


        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        cashMovementService
            .getAll(query)
            .then((res: AxiosResponse<ICashMovementsResponse>) => {
                setData(res?.data.result);
                setTotal(res?.data.total);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.log(err)
                if (
                    !!err?.response &&
                    !!err?.response?.data &&
                    !!err?.response?.data?.message
                ) {
                    notification.error({
                        message: "Error",
                        description: err.response?.data?.message,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    return {
        cashMovements: data,
        cashMovementsLoading: loading,
        cashMovementsRefresh: fetchData,
        cashMovementsTotal: total,
    };
};
