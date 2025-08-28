'use client';

import LeftMenu from "@/components/LeftMenu";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

const { Sider, Content } = Layout;

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    const items = [
        {
            key: "dashboard",
            label: "Dashboard",
            onClick: () => router.push("/dashboard"),
        },
        {
            key: "usuarios",
            label: "Usuários",
            onClick: () => router.push("/dashboard/usuarios"),
        },
    ];

    return (
        <Layout>
            <div className="flex">
                <LeftMenu />
                {children}
            </div>
        </Layout>
    );
};

