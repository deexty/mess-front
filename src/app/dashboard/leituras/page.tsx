'use client'

import PageContainer from "@/components/PageContainer";
import ListReadings from "@/components/Readings/List";
import { api } from "@/infra/services/api";
import { App, Button } from "antd";
import React, { useCallback, useState } from "react";

const CondominiumListPage: React.FC = React.memo(function CondominiumListPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const { notification } = App.useApp()

    const processHandle = useCallback(async () => {
        if (loading) return
        setLoading(true)

        await api.get('hydrometer/process-readings')
            .then(() => {
                notification.success({ message: 'Leituras', description: 'Leituras enviadas para processamento com sucesso' })
            }).catch((error) => {
                notification.error({ message: 'Leituras', description: error.response.data.message })
            }).finally(() => setLoading(false))
    }, [loading])



    return (
        <PageContainer header={{
            title: 'Leituras',
            description: "Consulte leituras cadastradas"
        }
        }
            action={<Button loading={loading} onClick={processHandle} type="primary" size="large">Processar leituras</Button>}
        >
            <ListReadings />
        </PageContainer>
    );
});

export default CondominiumListPage;