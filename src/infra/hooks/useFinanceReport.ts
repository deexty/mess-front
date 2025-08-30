"use client";

import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { api } from "../services/api";

interface IFinanceReport {
    month: string;
    year: string
    value: string
}

interface IFinanceReportResponseHook {
    financeReports: IFinanceReport[] | [];
    financeReportsLoading: boolean;
    financeReportsRefresh: VoidFunction;
}

export const useFinanceReports = ({
    condominium_id,
    status,
    contract_id
}: { condominium_id?: string, status?: string, contract_id?: string }): IFinanceReportResponseHook => {
    const [data, setData] = useState<IFinanceReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData = () => {
        if (loading) return;


        setLoading(true);


        api
            .get('/reports/finance', {
                params: {
                    condominium_id,
                    status,
                    contract_id
                }
            })
            .then((res: AxiosResponse<IFinanceReport[]>) => {
                setData(res?.data);
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
    }, [condominium_id, status, contract_id]);

    return {
        financeReports: data,
        financeReportsLoading: loading,
        financeReportsRefresh: fetchData,
    };
};
