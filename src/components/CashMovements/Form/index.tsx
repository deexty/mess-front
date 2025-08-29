import { useContracts } from "@/infra/hooks/useContracts";
import { CashMovementStatusEnum, ICreateCashMovement } from "@/infra/interfaces/cashMovement.interface";
import { FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import Masks from "@/infra/utils/Masks";
import useDebounce from "@/infra/utils/UseDebonce";
import { DatePicker, Form, FormInstance, Input, Select } from "antd";
import React, { useMemo, useState } from "react";
import { cashMovementStatusMapper } from "../Columns";

interface ICashMovementFormProps {
    form: FormInstance
    onSubmit: (data: ICreateCashMovement) => void
}

const CashMovementForm: React.FC<ICashMovementFormProps> = React.memo(function CashMovementForm({
    form,
    onSubmit
}) {
    const [searchContract, setSearchContract] = useState<string>("");
    const searchContractDebounced = useDebounce(searchContract, 500);
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

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} className="w-full max-w-[600px]">
            <Form.Item
                name="contract_id"
                label="Contrato"
                rules={[{ required: true, message: 'Contrato é obrigatorio' }]}
            >
                <Select
                    showSearch
                    size="large"
                    loading={contractsLoading}
                    searchValue={searchContract}
                    onSearch={setSearchContract}
                    filterOption={false}
                    notFoundContent={contractsLoading ? 'Carregando...' : 'Nenhum resultado'}
                    onChange={() => setSearchContract('')}
                    options={contracts?.map(c => ({
                        label: c.name,
                        value: String(c.id),
                    }))}
                />
            </Form.Item>
            <Form.Item name="amount" label="Valor" rules={[{ required: true, message: 'Valor' }]}>
                <Input size="large" onChange={(e) => form.setFieldValue("amount", Masks.money(e.target.value))} />
            </Form.Item>
            <Form.Item name="status" label="Status" >
                <Select size="large" options={Object.values(CashMovementStatusEnum).map(s => ({ label: cashMovementStatusMapper[s].label, value: s }))} />
            </Form.Item>
            <Form.Item name="reference_date" label="Data de referencia" rules={[{ required: true, message: 'Data de referencia é obrigatorio' }]}>
                <DatePicker format="DD/MM/YYYY" size="large" />
            </Form.Item>

        </Form>
    );
});

export default CashMovementForm;