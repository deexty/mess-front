"use client";

import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { IUser } from "../interfaces/user.interface";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/ParseFilters";
import { IUsersResponse, userService } from "../services/user";

interface ISyndicResponseHook {
    users: IUser[] | [];
    usersLoading: boolean;
    usersRefresh: VoidFunction;
    usersTotal: number;
}

export const useUsers = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): ISyndicResponseHook => {
    const [data, setData] = useState<IUser[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData = () => {
        if (loading) return;


        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        userService
            .getAll(query)
            .then((res: AxiosResponse<IUsersResponse>) => {
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
        users: data,
        usersLoading: loading,
        usersRefresh: fetchData,
        usersTotal: total,
    };
};
