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
            key: "condominiums",
            label: "Condomínios",
            onClick: () => router.push("/dashboard/condominios"),
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