import { useCondominiums } from "@/infra/hooks/useCondominiums";
import { ICreateContract } from "@/infra/interfaces/contract.interface";
import { FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import Masks from "@/infra/utils/Masks";
import useDebounce from "@/infra/utils/UseDebonce";
import { DatePicker, Form, FormInstance, Input, Select } from "antd";
import React, { useMemo, useState } from "react";

interface IContractFormProps {
    form: FormInstance
    onSubmit: (data: ICreateContract) => void
}

const ContractForm: React.FC<IContractFormProps> = React.memo(function ContractForm({
    form,
    onSubmit
}) {
    const [searchCondominium, setSearchCondominium] = useState<string>("");
    const searchCondominiumDebounced = useDebounce(searchCondominium, 500);

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

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} className="w-full max-w-[600px]">
            <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Nome é obrigatório' }]}>
                <Input size="large" max={255} />
            </Form.Item>
            <Form.Item
                name="condominium_id"
                label="Condominio"
                rules={[{ required: true, message: 'Condominio é obrigatorio' }]}
            >
                <Select
                    showSearch
                    size="large"
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
                />
            </Form.Item>

            <Form.Item name="unit_qtd" label="Quantidade de unidades" rules={[{ required: true, message: 'Quantidade de unidades obrigatorio' }]}>
                <Input size="large" onChange={(e) => form.setFieldValue("unit_qtd", Masks.justNumbers(e.target.value))} />
            </Form.Item>
            <Form.Item name="month_value" label="Valor mensal" rules={[{ required: true, message: 'Valor mensal é obrigatorio' }]}>
                <Input size="large" onChange={(e) => form.setFieldValue("month_value", Masks.money(e.target.value))} />
            </Form.Item>
            <Form.Item name="comission" label="Valor comissão" >
                <Input size="large" onChange={(e) => form.setFieldValue("comission", Masks.money(e.target.value))} />
            </Form.Item>
            <Form.Item name="expiration_date" label="Data de vencimento" rules={[{ required: true, message: 'Data de vencimento é obrigatorio' }]}>
                <DatePicker format="DD/MM/YYYY" size="large" />
            </Form.Item>

        </Form>
    );
});

export default ContractForm;