import { api } from "@/infra/services/api";
import { App, Button, DatePicker, Form, Modal, Upload } from "antd";
import { UploadIcon } from "lucide-react";
import React, { useState } from "react";

interface ITelemetryModalProps {
    refresh?: () => void
}

const TelemetryModal: React.FC<ITelemetryModalProps> = React.memo(function TelemetryModal({
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const onSubmit = async (values: any) => {
        setLoading(true)

        const formData = new FormData()

        formData.append('file', values.file)

        await api.post('/telemetry/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            notification.success({ message: 'Telemetria', description: 'Telemetria processada com sucesso' })
            setOpen(false)
            form.resetFields()
            refresh?.()
        }).catch((error) => {
            notification.error({ message: 'Telemetria', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} size="large">Importar telemetria</Button>
            <Modal title="Importar telemetria" open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }} okButtonProps={{ size: 'large', loading }} cancelButtonProps={{ size: 'large' }} okText="Importar" onOk={form.submit}>
                <Form form={form} layout="vertical" onFinish={onSubmit} className="flex-1" >
                    <Form.Item name="file" className="flex-1" >
                        <p className="my-2">Selecione um arquivo txt para importar a telemetria</p>
                        <Upload
                            className="w-full"
                            accept=".txt"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const f = info.file.originFileObj ?? info.file;
                                form.setFieldValue("file", f);
                            }} >
                            <div className="w-full h-full flex items-center justify-center">
                                <Button icon={<UploadIcon size={14} />} className="w-full" size="large">
                                    Selecionar arquivo Telemeria
                                </Button>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default TelemetryModal;