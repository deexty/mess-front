'use client'

import CondominiumsForm from "@/components/Condominiums/Form";
import ListHydromethers from "@/components/Hydromethers/List";
import PageContainer from "@/components/PageContainer";
import ListReadings from "@/components/Readings/List";
import { useAuth } from "@/contexts/useAuth";
import { useCondominium } from "@/infra/hooks/useCondominium";
import { useHydrometers } from "@/infra/hooks/useHydrometers";
import { IUserType } from "@/infra/interfaces/user.interface";
import { App, Button, Form, Table, Tabs } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ViewCondominiumPage: React.FC = React.memo(function ViewCondominiumPage() {
    const { user } = useAuth()

    const { id } = useParams()
    const router = useRouter()

    const [form] = Form.useForm();

    const { condominium } = useCondominium(id as string)

    useEffect(() => {
        if (!condominium) return
        form.setFieldsValue(condominium)
    }, [condominium])

    return (
        <PageContainer title="Visualizar condomínio" canBack >
            <Tabs items={[
                {
                    key: 'condominium',
                    label: 'Condominio',
                    children: <div className="flex flex-col gap-4 justify-end items-end">
                        {user?.role === IUserType.ADMIN && <Button type="primary" size="large" onClick={() => router.push(`/dashboard/condominios/editar/${id}`)}>Editar condominio</Button>}
                        <CondominiumsForm isView form={form} onSubmit={(data) => console.log(data)} />
                    </div>,
                },
                {
                    key: 'hidometers',
                    label: 'Hidrômetros',
                    children: <ListHydromethers condominiumId={id as string} />
                },
                {
                    key: 'readings',
                    label: 'Leituras',
                    children: <ListReadings condominiumId={id as string} hasActions={false} />
                }
            ]} />

        </PageContainer>
    );
});

export default ViewCondominiumPage;