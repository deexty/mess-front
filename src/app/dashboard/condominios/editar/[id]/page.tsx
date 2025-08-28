'use client'

import CondominiumsForm from "@/components/Condominiums/Form";
import PageContainer from "@/components/PageContainer";
import { useCondominium } from "@/infra/hooks/useCondominium";
import { ICreateCondominium } from "@/infra/interfaces/condominium.interface";
import { condominiumService } from "@/infra/services/condominium";
import { App, Button, Form } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditCondominiumPage: React.FC = React.memo(function EditCondominiumPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams()
    const router = useRouter()


    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const { condominium } = useCondominium(id as string)

    const updateCondominiumHandle = async (values: ICreateCondominium) => {
        if (loading) return

        await condominiumService.update(values, id as string).then(() => {
            notification.success({ message: 'Condominium', description: 'Condominium criado com sucesso' })
            router.push(`/dashboard/condominios`)
        }).catch((error) => {
            notification.error({ message: 'Condominium', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (!condominium) return
        form.setFieldsValue(condominium)
    }, [condominium])

    return (
        <PageContainer title="Editar condomínio" canBack >
            <CondominiumsForm form={form} onSubmit={updateCondominiumHandle} />
            <div className="flex justify-end">
                <Button htmlType="submit" type="primary" size="large" loading={loading} onClick={form.submit}>Editar condominio</Button>
            </div>
        </PageContainer>
    );
});

export default EditCondominiumPage;