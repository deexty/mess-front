import { App, Button, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from "react";
import { api } from "@/infra/services/api";

interface IMultiUploadModalProps {
    refresh?: () => void
}

const MultiUploadModal: React.FC<IMultiUploadModalProps> = React.memo(function MultiUploadModal({
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const { notification } = App.useApp()


    const onSubmit = useCallback(async () => {
        setLoading(true)

        const formData = new FormData()

        for (const file of files) {
            formData.append('files', file)
        }

        await api.post('/hydrometer/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            notification.success({
                message: "Leitura", description: "Leitura criada com sucesso"
            })
            setOpen(false)
            refresh?.()
        }).catch((error) => {
            notification.error({
                message: "Leitura", description: error.response.data.message
            })
        }).finally(() => setLoading(false))
    }, [files, loading])


    return (
        <>
            <Button onClick={() => setOpen(true)} size="large">Fazer upload de imagems</Button>
            <Modal open={open} onCancel={() => setOpen(false)} title={'Fazer upload de imagems'} okText="Enviar" onOk={onSubmit} cancelButtonProps={{ size: 'large' }} okButtonProps={{ size: 'large', loading }} >
                <Dragger onChange={(info) => setFiles(info.fileList)} accept="image/*" beforeUpload={() => false}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Clique ou arraste os arquivos para este área</p>
                </Dragger>
            </Modal>
        </>
    );
});

export default MultiUploadModal;