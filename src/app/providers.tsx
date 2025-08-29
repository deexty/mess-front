"use client";

import { PropsWithChildren } from "react";
import { App, ConfigProvider } from "antd";
import ptBR from 'antd/es/locale/pt_BR'


export default function Providers({ children }: PropsWithChildren) {
    return (
        <ConfigProvider
            locale={ptBR}
            theme={{
                token: {
                    colorPrimary: "#A0222E",
                    colorBgContainer: "#FFF",
                },
            }}
        >
            <App>{children}</App>
        </ConfigProvider>
    );
}
