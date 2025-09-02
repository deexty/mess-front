'use client'

import { CondominiumColumns } from "@/components/Condominiums/Columns";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/contexts/useAuth";
import { useCondominiums } from "@/infra/hooks/useCondominiums";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import { IUserType } from "@/infra/interfaces/user.interface";
import useDebounce from "@/infra/utils/UseDebonce";
import { Button, Input, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const CondominiumListPage: React.FC = React.memo(function CondominiumListPage() {
    const router = useRouter()
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const searchTextDebounced = useDebounce(searchText, 500)
    const { user } = useAuth()

    const { condominiums, condominiumsLoading, condominiumsRefresh, condominiumsTotal } = useCondominiums({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => filters, [filters])
    })

    useEffect(() => {
        if (searchTextDebounced) {
            setFilters([
                {
                    filterBy: "corporate_name",
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
            title: 'Condomínios',
            description: "Consulte condomínios cadastrados"
        }}>
            <div className="flex justify-between mb-8">
                <Input size="large" className="flex-1 max-w-1/2" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar condominios" />
                {user?.role === IUserType.ADMIN && <Button onClick={() => router.push("/dashboard/condominios/criar")} type="primary" size="large" >Criar Condominio</Button>}
            </div>
            <Table dataSource={condominiums} loading={condominiumsLoading} columns={CondominiumColumns(condominiumsRefresh)}
                pagination={
                    {
                        total: condominiumsTotal,
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

export default CondominiumListPage;