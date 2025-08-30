'use client'

import PageContainer from "@/components/PageContainer";
import { CashMovementsColumns } from "@/components/CashMovements/Columns";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import useDebounce from "@/infra/utils/UseDebonce";
import { Button, Input, Select, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useCashMovements } from "@/infra/hooks/useCashMovements";
import { useCondominiums } from "@/infra/hooks/useCondominiums";
import { useContracts } from "@/infra/hooks/useContracts";
import CreateCashMovementModal from "@/components/CashMovements/Create";
import { useFinanceReports } from "@/infra/hooks/useFinanceReport";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CashMovementsListPage: React.FC = React.memo(function CashMovementsListPage() {
    const router = useRouter()
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])

    const { cashMovements, cashMovementsLoading, cashMovementsRefresh, cashMovementsTotal } = useCashMovements({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => filters, [filters])
    })

    const [searchCondominium, setSearchCondominium] = useState<string>("");
    const searchCondominiumDebounced = useDebounce(searchCondominium, 500);
    const [selectedCondominium, setSelectedCondominium] = useState<string | null>(null);
    const { condominiums, condominiumsLoading } = useCondominiums({
        page: 1,
        per_page: 100,
        filters: useMemo(() => {
            if (searchCondominiumDebounced) {
                return [
                    {
                        filterBy: "corporate_name",
                        filterValue: searchCondominiumDebounced,
                        filterType: FilterTypeEnum.LIKE,
                    },
                ];
            } else {
                return [];
            }
        }, [searchCondominiumDebounced])
    })


    const [searchContract, setSearchContract] = useState<string>("");
    const searchContractDebounced = useDebounce(searchContract, 500);
    const [selectedContract, setSelectedContract] = useState<string | null>(null);
    const { contracts, contractsLoading } = useContracts({
        page: 1,
        per_page: 100,
        filters: useMemo(() => {
            if (searchContractDebounced) {
                return [
                    {
                        filterBy: "corporate_name",
                        filterValue: searchContractDebounced,
                        filterType: FilterTypeEnum.LIKE,
                    },
                ];
            } else {
                return [];
            }
        }, [searchContractDebounced])
    })

    const { financeReports } = useFinanceReports({
        condominium_id: useMemo(() => selectedCondominium, [selectedCondominium]),
        contract_id: useMemo(() => selectedContract, [selectedContract])
    })


    useEffect(() => {
        const newFilters: IParseFilter[] = []

        if (selectedCondominium) {
            newFilters.push({
                filterBy: "contract.condominium_id",
                filterValue: selectedCondominium,
                filterType: FilterTypeEnum.EQUAL
            })
        }

        if (selectedContract) {
            newFilters.push({
                filterBy: "contract_id",
                filterValue: selectedContract,
                filterType: FilterTypeEnum.EQUAL
            })
        }

        setFilters(newFilters)
    }, [selectedCondominium, selectedContract])

    return (
        <PageContainer header={{
            title: 'Financeiro',
            description: "Gerencie as movimentações de caixa"
        }}>
            <div className="flex justify-between mb-8">
                <div className="flex gap-4">
                    <Select
                        onClear={() => setSelectedCondominium(null)}
                        allowClear
                        showSearch
                        size="large"
                        className="min-w-[200px]"
                        onSelect={(value) => setSelectedCondominium(value)}
                        loading={condominiumsLoading}
                        searchValue={searchCondominium}
                        onSearch={setSearchCondominium}
                        filterOption={false}
                        notFoundContent={condominiumsLoading ? 'Carregando...' : 'Nenhum resultado'}
                        onChange={() => setSearchCondominium('')}
                        options={condominiums?.map(c => ({
                            label: c.corporate_name,
                            value: String(c.id),
                        }))}
                        placeholder="Filtrar por condominio"
                    />
                    <Select
                        onClear={() => setSelectedContract(null)}
                        allowClear
                        className="min-w-[200px]"
                        showSearch
                        size="large"
                        onSelect={(value) => setSelectedContract(value)}
                        loading={contractsLoading}
                        searchValue={searchContract}
                        onSearch={setSearchContract}
                        filterOption={false}
                        notFoundContent={contractsLoading ? 'Carregando...' : 'Nenhum resultado'}
                        onChange={() => setSearchContract('')}
                        placeholder="Filtrar por contrato"
                        options={contracts?.map(c => ({
                            label: c.name,
                            value: String(c.id),
                        }))}
                    />
                </div>
                <CreateCashMovementModal refresh={cashMovementsRefresh} />
            </div>
            <FinanceChart data={financeReports} />
            <Table rowKey={(record) => record.id} dataSource={cashMovements} loading={cashMovementsLoading} columns={CashMovementsColumns(cashMovementsRefresh)}
                pagination={
                    {
                        total: cashMovementsTotal,
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


type FinanceReportItem = {
    year: string;
    month: string;
    value: string;
};

interface Props {
    data: FinanceReportItem[];
}

export function FinanceChart({ data }: Props) {
    const labels = data.map((d) => `${d.month}/${d.year}`);
    const values = data.map((d) => parseFloat(d.value));

    const chartData = {
        labels,
        datasets: [
            {
                label: "Faturamento",
                data: values,
                backgroundColor: "rgba(54, 162, 235, 0.7)", // azul
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Relatório Financeiro Mensal" },
        },
        scales: { y: { beginAtZero: true } },
    };

    return <div className="h-[350px] mb-8">
        <Bar data={chartData} options={options} />
    </div>;
}
export default CashMovementsListPage;