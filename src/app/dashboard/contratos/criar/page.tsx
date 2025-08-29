'use client'

import ContractForm from "@/components/Contracts/Form";
import PageContainer from "@/components/PageContainer";
import { ICreateContract } from "@/infra/interfaces/contract.interface";
import { contractService } from "@/infra/services/contract";
import Masks from "@/infra/utils/Masks";
import { App, Button, Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateContractPage: React.FC = React.memo(function CreateContractPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const createContractHandle = async (values: ICreateContract) => {
        if (loading) return

        await contractService.create({
            ...values,
            month_value: Masks.clearMoney(String(values.month_value)),
            comission: Masks.clearMoney(String(values.comission))
        }).then(() => {
            notification.success({ message: 'Contracto', description: 'Contracto criado com sucesso' })
            router.push(`/dashboard/contratos`)
        }).catch((error) => {
            notification.error({ message: 'Contracto', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <PageContainer title="Novo contrato" canBack>
            <ContractForm form={form} onSubmit={createContractHandle} />
            <div className="flex justify-end">
                <Button htmlType="submit" type="primary" size="large" loading={loading} onClick={form.submit}>Criar contrato</Button>
            </div>
        </PageContainer>
    );
});

export default CreateContractPage;