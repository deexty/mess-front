'use client'

import PageContainer from "@/components/PageContainer";
import { UserColumns } from "@/components/Users/Columns";
import CreateSindicModal from "@/components/Users/Create";
import { useUsers } from "@/infra/hooks/useUsers";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import { IUserType } from "@/infra/interfaces/user.interface";
import useDebounce from "@/infra/utils/UseDebonce";
import { Button, Input, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const SyndicsListPage: React.FC = React.memo(function SyndicsListPage() {
    const router = useRouter()
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const searchTextDebounced = useDebounce(searchText, 500)

    const { users, usersLoading, usersRefresh, usersTotal } = useUsers({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => [
            ...filters,
            {
                filterBy: "role",
                filterValue: IUserType.SYNDIC,
                filterType: FilterTypeEnum.EQUAL
            }
        ], [filters])
    })

    useEffect(() => {
        if (searchTextDebounced) {
            setFilters([
                {
                    filterBy: "name",
                    filterValue: searchTextDebounced,
                    filterType: FilterTypeEnum.LIKE
                }
            ])
        } else {
            setFilters([])
        }
    }, [searchTextDebounced])

    return (
        <PageContainer header={{
            title: 'Sindicos',
            description: "Consulte sindícos cadastrados"
        }}>
            <div className="flex justify-between mb-8">
                <Input size="large" className="flex-1 max-w-1/2" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar sindicos" />
                <CreateSindicModal refresh={usersRefresh} />
            </div>
            <Table dataSource={users} loading={usersLoading} columns={UserColumns(usersRefresh)}
                pagination={
                    {
                        total: usersTotal,
                        current: page,
                        onChange(page, _pageSize) {

                            setPage(page)
                        },
                    }
                }
            />
        </PageContainer>
    );
});

export default SyndicsListPage;