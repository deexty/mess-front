import { ICreateHydrometer, IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { App, Button, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ReadingForm from "../Form";
import { hydrometerService } from "@/infra/services/hydromether";
import { GoPlus } from "react-icons/go";
import { ICreateReading } from "@/infra/interfaces/reading.interface";


interface ICreateReadingModalProps {
    condominiumId?: string
}

const CreateReadingModal: React.FC<ICreateReadingModalProps> = React.memo(function CreateReadingModal({
    condominiumId
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const createReading = async (data: ICreateReading) => {
        try {
            setLoading(true)

            const newFormData = new FormData()

            for (const [key, value] of Object.entries(data)) {
                newFormData.append(key, value)
            }

            await hydrometerService.createReading(newFormData)
            setOpen(false)
            form.resetFields()
            notification.success({ message: 'Leitura', description: 'Leitura criada com sucesso' })
        } catch (error) {
            notification.error({ message: 'Leitura', description: error.response.data.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<GoPlus />} size="large">Adicionar leitura</Button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }} title="Adicionar leitura" okText="Salvar" onOk={form.submit} okButtonProps={{ size: 'large', loading: loading }} cancelButtonProps={{ size: 'large' }}>
                <ReadingForm form={form} onSubmit={createReading} condominiumId={condominiumId} />
            </Modal>
        </>
    );
});

export default CreateReadingModal;