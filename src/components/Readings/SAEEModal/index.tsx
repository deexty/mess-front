import { api } from "@/infra/services/api";
import { App, Button, DatePicker, Form, Modal, Upload } from "antd";
import { UploadIcon } from "lucide-react";
import React, { useState } from "react";

const SAEEModal: React.FC = React.memo(function SAEEModal() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const onSubmit = async (values: any) => {
        setLoading(true)

        const formData = new FormData()

        formData.append('reference_date', values.reference_date.format('YYYY-MM'))
        formData.append('file', values.file)

        await api.post('saae/process', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `SAAE-${values.reference_date.format('YYYY-MM')}.txt`);
            document.body.appendChild(link);
            link.click();
            notification.success({ message: 'SAAE', description: 'SAAE processado com sucesso' })
            setOpen(false)
            form.resetFields()
        }).catch((error) => {
            notification.error({ message: 'SAAE', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} size="large" >Gerar SAAE</Button>
            <Modal title="Gerar SAAE" open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }} okButtonProps={{ size: 'large', loading }} cancelButtonProps={{ size: 'large' }} okText="Gerar" onOk={form.submit}>
                <Form form={form} layout="vertical" onFinish={onSubmit} >
                    <Form.Item name="reference_date" label="Data de referência" rules={[{ required: true, message: 'Data de referência é obrigatorio' }]}>
                        <DatePicker format="MM/YYYY" size="large" />
                    </Form.Item>
                    <Form.Item name="file" label="Arquivo SAAE">
                        <Upload
                            accept=".txt"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const f = info.file.originFileObj ?? info.file;
                                form.setFieldValue("file", f);
                            }} >
                            <Button icon={<UploadIcon size={14} />} className="w-full">
                                Selecionar arquivo SAAE
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default SAEEModal;