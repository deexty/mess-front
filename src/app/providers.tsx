"use client";

import { PropsWithChildren } from "react";
import { App, ConfigProvider } from "antd";

export default function Providers({ children }: PropsWithChildren) {
    return (
        <ConfigProvider
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
