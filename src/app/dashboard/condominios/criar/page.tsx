'use client'

import CondominiumsForm from "@/components/Condominiums/Form";
import PageContainer from "@/components/PageContainer";
import { ICreateCondominium } from "@/infra/interfaces/condominium.interface";
import { condominiumService } from "@/infra/services/condominium";
import { App, Button, Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateCondominiumPage: React.FC = React.memo(function CreateCondominiumPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const createCondominiumHandle = async (values: ICreateCondominium) => {
        if (loading) return

        await condominiumService.create(values).then(() => {
            notification.success({ message: 'Condominium', description: 'Condominium criado com sucesso' })
            router.push(`/dashboard/condominios`)
        }).catch((error) => {
            notification.error({ message: 'Condominium', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <PageContainer title="Novo condomínio" canBack>
            <CondominiumsForm form={form} onSubmit={createCondominiumHandle} />
            <div className="flex justify-end">
                <Button htmlType="submit" type="primary" size="large" loading={loading} onClick={form.submit}>Criar condominio</Button>
            </div>
        </PageContainer>
    );
});

export default CreateCondominiumPage;