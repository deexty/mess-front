

import React, { useState } from 'react';
import { Modal, Button, Upload, message, InputNumber, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { api } from '@/infra/services/api';

interface IUploadHydrometersModalProps {
    condominiumId: string;
    refresh: () => void;
}

const UploadHydrometersModal: React.FC<IUploadHydrometersModalProps> = ({ condominiumId, refresh }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFileList([]);
        form.resetFields();
    };

    const handleUpload = async () => {
        try {
            const values = await form.validateFields();
            if (fileList.length === 0) {
                message.error('Por favor, selecione um arquivo CSV.');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileList[0]);
            formData.append('condominium_id', condominiumId);
            formData.append('red_digits', values.red_digits);
            formData.append('black_digits', values.black_digits);

            setUploading(true);

            await api.post('/hydrometer/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Hidrômetros importados com sucesso!');
            handleCancel();
            refresh();
        } catch (error) {
            if (error instanceof Error && 'errorFields' in error) {
                // Validation error
            } else {
                message.error('Ocorreu um erro ao importar os hidrômetros.');
            }
        } finally {
            setUploading(false);
        }
    };

    const props = {
        onRemove: (file: RcFile) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file: RcFile) => {
            const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
            if (!isCSV) {
                message.error('Você só pode fazer upload de arquivos .csv');
            } else {
                setFileList([file]);
            }
            return false;
        },
        fileList,
    };

    return (
        <>
            <Button icon={<UploadOutlined />} size="large" onClick={showModal}>
                Importar Hidrômetros
            </Button>
            <Modal
                title="Importar Hidrômetros"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={uploading}
                        onClick={handleUpload}
                    >
                        {uploading ? 'Importando...' : 'Iniciar Importação'}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="red_digits"
                        label="QTD. Dígitos Vermelhos (m³)"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="black_digits"
                        label="QTD. Dígitos Pretos (L)"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Arquivo CSV">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Selecione o arquivo CSV</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UploadHydrometersModal;

