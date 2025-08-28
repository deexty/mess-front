import { useHydrometers } from "@/infra/hooks/useUsers copy";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import useDebounce from "@/infra/utils/UseDebonce";
import { Input, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { HydrometherColumn } from "./Columns";
import CreateHydrometherModal from "../Create";
import CreateReadingModal from "@/components/Readings/Create";

interface IListHydromethersProps {
    condominiumId?: string
}

const ListHydromethers: React.FC<IListHydromethersProps> = React.memo(function ListHydromethers({
    condominiumId
}) {
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const searchTextDebounced = useDebounce(searchText, 500)

    const { hydrometers, hydrometersTotal, hydrometersLoading, hydrometersRefresh } = useHydrometers({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => [
            {
                filterBy: "condominium_id",
                filterValue: condominiumId as string,
                filterType: FilterTypeEnum.EQUAL
            }, ...filters
        ], [filters]),
        canExecute: !!condominiumId
    })

    useEffect(() => {
        const newFilters: IParseFilter[] = []



        if (searchTextDebounced) {
            newFilters.push({
                filterBy: "identifier",
                filterValue: searchTextDebounced,
                filterType: FilterTypeEnum.LIKE
            })
        }

        setFilters(newFilters)
    }, [searchTextDebounced])


    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 justify-between items-center">
                <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por identificador" className="flex-1 max-w-1/3" size="large" />
                <div className="flex gap-4 items-center">
                    <CreateReadingModal condominiumId={condominiumId as string} />
                    <CreateHydrometherModal refresh={hydrometersRefresh} condominiumId={condominiumId as string} />
                </div>

            </div>
            <Table dataSource={hydrometers} pagination={
                {
                    total: hydrometersTotal,
                    current: page,
                    onChange(page, _pageSize) {

                        setPage(page)
                    },
                }
            }
                loading={hydrometersLoading}
                columns={HydrometherColumn(hydrometersRefresh)}
            />
        </div>
    );
});

export default ListHydromethers;