'use client'

import AddDocumentModal from "@/components/Contracts/AddDocument";
import PageContainer from "@/components/PageContainer";
import { useContract } from "@/infra/hooks/useContract";
import { App, Button, Descriptions, Divider } from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import React from "react";

const ViewContractPage: React.FC = React.memo(function ViewContractPage() {
    const { id } = useParams()

    const { contract, fetchContract } = useContract(id as string)


    return (
        <PageContainer title="Visualizar contrato" canBack action={<AddDocumentModal refresh={fetchContract} contract_id={contract?.id as string} />}>
            <Descriptions
                title="Detalhes do Contrato"
                bordered={false}
                column={2}
                size="middle"
            >
                <Descriptions.Item label="Nome">{contract?.name}</Descriptions.Item>
                <Descriptions.Item label="Condomínio">
                    {contract?.condominium.corporate_name}
                </Descriptions.Item>
                <Descriptions.Item label="CNPJ">
                    {contract?.condominium.cnpj}
                </Descriptions.Item>
                <Descriptions.Item label="Qtd. Unidades">
                    {contract?.unit_qtd}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Mensal">
                    R$ {Number(contract?.month_value).toLocaleString("pt-BR")}
                </Descriptions.Item>
                <Descriptions.Item label="Comissão">
                    {contract?.comission}%
                </Descriptions.Item>
                <Descriptions.Item label="Vencimento">
                    {dayjs(contract?.expiration_date).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Criado em">
                    {dayjs(contract?.created_at).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Documentos</Divider>
            <ContractDocumentsList data={contract?.documents} fileBaseUrl={process.env.NEXT_PUBLIC_API_URL_FILES} refresh={fetchContract} />
        </PageContainer>
    );
});

import { Empty, List, Popconfirm, Space, Tag, Typography } from "antd";
import { DownloadOutlined, DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import { api } from "@/infra/services/api";

type ContractDoc = {
    id: string;
    created_at: string;
    updated_at: string;
    file_path: string;
    contract_id: string;
};

type IndexedDocs = Record<string, ContractDoc>;

function normalizeDocs(indexed: IndexedDocs): ContractDoc[] {
    return Object.values(indexed ?? {});
}

interface ContractDocumentsListProps {
    data: IndexedDocs;
    onDelete?: (doc: ContractDoc) => Promise<void> | void;
    refresh?: () => void;
    fileBaseUrl?: string;
}
function ContractDocumentsList({
    data,
    fileBaseUrl = "",
    refresh
}: ContractDocumentsListProps) {
    const docs = normalizeDocs(data);
    const { notifiation } = App.useApp()

    if (!docs.length) {
        return <Empty description="Nenhum documento ainda" />;
    }

    const buildFileUrl = (fp: string) => {
        if (/^https?:\/\//i.test(fp)) return fp;
        const base = fileBaseUrl
            .replace(/\/$/, "") // remove / final
            .replace(/\/tmp\//, "/"); // remove /tmp/
        const path = fp.startsWith("/") ? fp : `/${fp}`;

        return `${base}${path.replace(/^\/?\.tmp/, "")}`;

    };

    const onDelete = async (doc: ContractDoc) => {
        await api.delete(`contracts/documents/${doc.id}`).then(() => {
            refresh?.()
            console.log(refresh)
            notifiation.success({
                message: 'Documento',
                description: 'Documento excluído com sucesso'
            })
        }).catch(() => {
            notifiation.error({
                message: 'Documento',
                description: 'Erro ao excluir documento'
            })
        });
    };

    return (
        <List
            itemLayout="horizontal"
            dataSource={docs}
            renderItem={(item) => {
                const fileUrl = buildFileUrl(item.file_path);
                const filename = item.file_path.split("/").pop() || item.id;

                return (
                    <List.Item
                        actions={[
                            // BAIXAR
                            <Button
                                key="download"
                                type="default"
                                icon={<DownloadOutlined />}
                                href={fileUrl}
                                target="_blank"
                                // 'download' sugere o download direto quando possível
                                download={filename}
                            >
                                Baixar
                            </Button>,

                            // DELETAR (com confirmação)
                            <Popconfirm
                                key="delete"
                                title="Confirmar exclusão"
                                description={`Deseja excluir o arquivo "${filename}"?`}
                                okText="Excluir"
                                cancelText="Cancelar"
                                onConfirm={() => onDelete?.(item)}
                            >
                                <Button danger icon={<DeleteOutlined />}>
                                    Deletar
                                </Button>
                            </Popconfirm>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<FileImageOutlined style={{ fontSize: 22 }} />}
                            title={
                                <Space size="small" wrap>
                                    <Typography.Text strong>{filename}</Typography.Text>
                                    <Tag color="blue">#{item.id.slice(0, 8)}</Tag>
                                </Space>
                            }
                            description={
                                <Space size="middle" wrap>
                                    <span>
                                        Criado:{" "}
                                        <Typography.Text>
                                            {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                                        </Typography.Text>
                                    </span>
                                    <span>
                                        Atualizado:{" "}
                                        <Typography.Text type="secondary">
                                            {dayjs(item.updated_at).format("DD/MM/YYYY HH:mm")}
                                        </Typography.Text>
                                    </span>
                                </Space>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
}


export default ViewContractPage;