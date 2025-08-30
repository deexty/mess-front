'use client'

import PageContainer from "@/components/PageContainer";
import ListReadings from "@/components/Readings/List";
import React from "react";

const CondominiumListPage: React.FC = React.memo(function CondominiumListPage() {



    return (
        <PageContainer header={{
            title: 'Leituras',
            description: "Consulte leituras cadastradas"

        }}
        >
            <ListReadings />
        </PageContainer>
    );
});

export default CondominiumListPage;