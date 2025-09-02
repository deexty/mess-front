'use client'

import { useReadings } from "@/infra/hooks/useReadings";
import { IParseFilter, FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import useDebounce from "@/infra/utils/UseDebonce";
import { Input, Button, Table, DatePicker, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { ReadingColumn } from "./Columns";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ReadingStatusMapper } from "@/infra/interfaces/reading.interface";
import SAEEModal from "../SAEEModal";
import TelemetryModal from "../TelemetryModal";
import CreateReadingModal from "../Create";
import MultiUploadModal from "../MultiUploadModal";

interface IListReadingsProps {
    condominiumId?: string
    hasActions?: boolean
}

const ListReadings: React.FC<IListReadingsProps> = React.memo(function ListReadings({
    condominiumId,
    hasActions = true
}) {
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [dateFilter, setDateFilter] = useState<[Date | null, Date | null]>()
    const [statusFilter, setStatusFilter] = useState<string>("")

    const { readings, readingsLoading, readingsRefresh, readingsTotal } = useReadings({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => {
            if (!condominiumId) return filters

            return [
                {
                    filterBy: "hydrometer.condominium_id",
                    filterValue: condominiumId,
                    filterType: FilterTypeEnum.EQUAL
                },
                ...filters
            ]
        }, [filters]),
        orderers: {
            orderBy: "created_at",
            orderType: "DESC"
        }
    })

    useEffect(() => {
        const newFilters: IParseFilter[] = []

        if (statusFilter) {
            newFilters.push({
                filterBy: "status",
                filterValue: statusFilter,
                filterType: FilterTypeEnum.EQUAL
            })
        }

        if (dateFilter) {
            newFilters.push({
                filterBy: "created_at",
                filterValue: `${dayjs(dateFilter[0]).format("YYYY-MM-DD")}|${dayjs(dateFilter[1]).format("YYYY-MM-DD")}`,
                filterType: FilterTypeEnum.BTW
            })

        }

        setFilters(newFilters)
    }, [dateFilter, statusFilter])

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-4  items-center">
                    {/* @ts-expect-error any */}
                    <DatePicker.RangePicker onChange={setDateFilter} value={dateFilter} format="DD/MM/YYYY" size="large" />
                    <Select className="min-w-[200px]" placeholder="Status" size="large" options={Object.keys(ReadingStatusMapper).map(s => ({ label: ReadingStatusMapper[s as keyof typeof ReadingStatusMapper], value: s }))} onChange={setStatusFilter} />
                </div>
                <div className="flex gap-4 items-center">
                    <MultiUploadModal refresh={readingsRefresh} />
                    <CreateReadingModal refresh={readingsRefresh} />
                    {hasActions && (
                        <>
                            <TelemetryModal refresh={readingsRefresh} />
                            <SAEEModal />
                        </>
                    )}
                </div>

            </div>
            <Table rowKey="id" dataSource={readings} loading={readingsLoading} columns={ReadingColumn(readingsRefresh)}
                pagination={
                    {
                        total: readingsTotal,
                        current: page,
                        onChange(page, _pageSize) {

                            setPage(page)
                        },
                    }
                }
            />
        </>
    );
});

export default ListReadings;