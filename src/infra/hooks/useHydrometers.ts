"use client";

import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/ParseFilters";
import { IHydrometer } from "../interfaces/hydrometer.interface";
import { hydrometerService, IHydrometersResponse } from "../services/hydromether";

interface IHydrometerResponseHook {
    hydrometers: IHydrometer[] | [];
    hydrometersLoading: boolean;
    hydrometersRefresh: VoidFunction;
    hydrometersTotal: number;
}

export const useHydrometers = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): IHydrometerResponseHook => {
    const [data, setData] = useState<IHydrometer[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData = () => {
        if (loading) return;


        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        hydrometerService
            .getAll(query)
            .then((res: AxiosResponse<IHydrometersResponse>) => {
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
        hydrometers: data,
        hydrometersLoading: loading,
        hydrometersRefresh: fetchData,
        hydrometersTotal: total,
    };
};
