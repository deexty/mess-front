'use client'

import { useRouter } from "next/navigation";
import React from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

interface IPageContainerProps {
    children: React.ReactNode;
    canBack?: boolean
    title?: string
    action?: React.ReactNode
    header?: {
        title: string
        description?: string
    }
}

const PageContainer: React.FC<IPageContainerProps> = React.memo(function PageContainer(
    {
        children,
        canBack,
        action,
        title,
        header
    }
) {
    const router = useRouter();

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-8">
            <div className="w-full bg-white p-8 rounded-2xl">
                {header && (
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold">
                            {header.title}
                        </h1>
                        {header.description && (
                            <p className="text-base">
                                {header.description}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex justify-between items-center">
                    {canBack && (
                        <button className="cursor-pointer flex items-center mb-8 gap-2" onClick={() => router.back()}>
                            <FaRegArrowAltCircleLeft size={20} />
                            <h1 className="text-xl font-bold text-gray-900">
                                {title}
                            </h1>
                        </button>
                    )}
                    {action}
                </div>
                {children}
            </div>
        </div>
    );
});

export default PageContainer;