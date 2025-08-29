'use client';

import { Menu } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const LeftMenu: React.FC = React.memo(function LeftMenu() {
    const router = useRouter();

    const items = [
        {
            key: "dashboard",
            label: "Dashboard",
            onClick: () => router.push("/dashboard"),
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
            key: "contratos",
            label: "Contratos",
            onClick: () => router.push("/dashboard/contratos"),
        },
        {
            key: "financeiro",
            label: "Financeiro",
            onClick: () => router.push("/dashboard/financeiro"),
        },
    ];

    return (
        <div className="h-screen flex justify-center items-center min-w-[250px] bg-white px-4">
            <Menu
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
                items={items}
            />
        </div>
    );
});

export default LeftMenu;