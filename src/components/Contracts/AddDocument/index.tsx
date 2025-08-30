import { api } from "@/infra/services/api";
import { App, Button, Form, Modal, Upload } from "antd";
import { UploadIcon } from "lucide-react";
import React, { useState } from "react";

interface IAddDocumentModalProps {
    contract_id: string, refresh?: () => void
}

const AddDocumentModal: React.FC<IAddDocumentModalProps> = React.memo(function AddDocumentModal({
    contract_id, refresh
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const onSubmit = async (data: { file: File }) => {
        setLoading(true)

        const formData = new FormData()

        formData.append('file', data.file)

        api.post(`/contracts/${contract_id}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            notification.success({ message: 'Documento', description: 'Documento adicionado com sucesso' })
            setOpen(false)
            form.resetFields()
            refresh()
        }).catch((error) => {
            notification.error({ message: 'Documento', description: error.response.data.message })
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)} size="large">Adicionar documento</Button>
            <Modal open={open} onCancel={() => setOpen(false)} title="Adicionar documento" okText="Salvar" onOk={form.submit} okButtonProps={{ size: 'large', loading }} cancelButtonProps={{ size: 'large' }}>
                <Form form={form} onFinish={onSubmit}>
                    <Form.Item name="file" rules={[{ required: true, message: 'Arquivo é obrigatório' }]}>
                        <p className="my-2">Selecione o arquivo a ser adicionado ao contrato</p>
                        <Upload maxCount={1} beforeUpload={() => false} onChange={(info) => form.setFieldValue("file", info.file.originFileObj ?? info.file)}>
                            <Button icon={<UploadIcon size={16} />} className="w-full">
                                Selecionar arquivo
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});



export default AddDocumentModal;