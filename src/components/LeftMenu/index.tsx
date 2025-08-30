'use client';

import { useAuth } from "@/contexts/useAuth";
import { Button, Menu } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const LeftMenu: React.FC = React.memo(function LeftMenu() {
    const router = useRouter();
    const { logout } = useAuth()

    const items = [
        {
            key: "agenda",
            label: "Agenda",
            onClick: () => router.push("/dashboard/agenda"),
        },
        {
            key: "condominios",
            label: "Condomínios",
            onClick: () => router.push("/dashboard/condominios"),
        },
        {
            key: "sindicos",
            label: "Sindicos",
            onClick: () => router.push("/dashboard/sindicos"),
        },
        {
            key: "operadores",
            label: "Operadores",
            onClick: () => router.push("/dashboard/operadores"),
        },
        {
            key: "contratos",
            label: "Contratos",
            onClick: () => router.push("/dashboard/contratos"),
        },
        {
            key: "financeiro",
            label: "Financeiro",
            onClick: () => router.push("/dashboard/financeiro"),
        },
        {
            key: "leituras",
            label: "Leituras",
            onClick: () => router.push("/dashboard/leituras"),
        },
    ];

    return (
        <div className="flex items-center justify-between flex-col min-w-[250px] bg-white px-4 py-12 fixed h-screen">
            <img src="/messentech.png" alt="Logo" className="size-40" />
            <Menu
                mode="inline"
                defaultSelectedKeys={["agenda"]}
                items={items}
            />
            <Button className="w-full" onClick={() => {
                logout()
                router.push("/")
            }}>Sair</Button>

        </div>
    );
});

export default LeftMenu;