'use client'

import ContractForm from "@/components/Contracts/Form";
import PageContainer from "@/components/PageContainer";
import { useContract } from "@/infra/hooks/useContract";
import { ICreateContract } from "@/infra/interfaces/contract.interface";
import { contractService } from "@/infra/services/contract";
import Masks from "@/infra/utils/Masks";
import { App, Button, Form } from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const EditContractPage: React.FC = React.memo(function EditContractPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams()

    const router = useRouter()

    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const { contract } = useContract(id as string)

    const editContractHandle = async (values: ICreateContract) => {
        if (loading) return

        await contractService.update({
            ...values,
            month_value: Masks.clearMoney(String(values.month_value)),
            comission: Masks.clearMoney(String(values.comission))
        }, id as string).then(() => {
            notification.success({ message: 'Contracto', description: 'Contracto editado com sucesso' })
            router.push(`/dashboard/contratos`)
        }).catch((error) => {
            notification.error({ message: 'Contracto', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    React.useEffect(() => {
        if (contract) {
            form.setFieldsValue({
                ...contract,
                expiration_date: dayjs(contract.expiration_date, 'DD/MM/YYYY'),
                month_value: Masks.money(String(contract.month_value)),
                comission: Masks.money(String(contract.comission))
            })
        }
    }, [contract])

    return (
        <PageContainer title="Editar contrato" canBack>
            <ContractForm form={form} onSubmit={editContractHandle} />
            <div className="flex justify-end">
                <Button htmlType="submit" type="primary" size="large" loading={loading} onClick={form.submit}>Editar contrato</Button>
            </div>
        </PageContainer>
    );
});

export default EditContractPage;