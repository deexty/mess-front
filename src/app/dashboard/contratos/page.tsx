'use client'

import PageContainer from "@/components/PageContainer";
import { ContractColumns } from "@/components/Contracts/Columns";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import useDebounce from "@/infra/utils/UseDebonce";
import { Button, Input, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useContracts } from "@/infra/hooks/useContracts";

const ContractsListPage: React.FC = React.memo(function ContractsListPage() {
    const router = useRouter()
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const searchTextDebounced = useDebounce(searchText, 500)

    const { contracts, contractsLoading, contractsRefresh, contractsTotal } = useContracts({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => filters, [filters])
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
            title: 'Contratos',
            description: "Consulte contratos cadastrados"
        }}>
            <div className="flex justify-between mb-8">
                <Input size="large" className="flex-1 max-w-1/2" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar contratos" />
                <Button onClick={() => router.push("/dashboard/contratos/criar")} type="primary" size="large" >Criar contrato</Button>
            </div>
            <Table rowKey={(record) => record.id} dataSource={contracts} loading={contractsLoading} columns={ContractColumns(contractsRefresh)}
                pagination={
                    {
                        total: contractsTotal,
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

export default ContractsListPage;