"use client";

import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { ICondominium } from "../interfaces/condominium.interface";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/ParseFilters";
import { hydrometerService, IReadingsResponse } from "../services/hydromether";
import { IReading } from "../interfaces/reading.interface";

interface ISyndicResponseHook {
    readings: IReading[] | [];
    readingsLoading: boolean;
    readingsRefresh: VoidFunction;
    readingsTotal: number;
}

export const useReadings = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): ISyndicResponseHook => {
    const [data, setData] = useState<IReading[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData = () => {
        if (loading) return;


        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        hydrometerService
            .getReadings(query)
            .then((res: AxiosResponse<IReadingsResponse>) => {
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
        readings: data,
        readingsLoading: loading,
        readingsRefresh: fetchData,
        readingsTotal: total,
    };
};
