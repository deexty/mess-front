import { ICreateHydrometer, IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { App, Button, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ReadingForm from "../Form";
import { hydrometerService } from "@/infra/services/hydromether";
import { ICreateReading, IReading } from "@/infra/interfaces/reading.interface";
import dayjs from "dayjs";


interface IEditReadingModalProps {
    condominiumId?: string
    refresh?: () => void
    record: IReading
}

const EditReadingModal: React.FC<IEditReadingModalProps> = React.memo(function EditReadingModal({
    condominiumId,
    refresh,
    record
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const createReading = async (data: ICreateReading) => {
        console.log(data)
        try {
            setLoading(true)

            await hydrometerService.updateReading(data, record.id as string)
            setOpen(false)
            form.resetFields()
            notification.success({ message: 'Leitura', description: 'Leitura criada com sucesso' })
            refresh?.()
        } catch (error) {
            notification.error({ message: 'Leitura', description: error.response.data.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (record) {
            const imagePath = record?.image_path?.replace(/\.tmp\//, '')
            form.setFieldsValue({ ...record, file: `${process.env.NEXT_PUBLIC_API_URL_FILES}${imagePath}`, reference_date: record.reference_date ? dayjs(record.reference_date) : null })
        }
    }, [record])

    return (
        <>
            <button onClick={() => setOpen(true)}>teste</button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
            }} title="Adicionar leitura" okText="Salvar" onOk={form.submit} okButtonProps={{ size: 'large', loading: loading }} cancelButtonProps={{ size: 'large' }}>
                <ReadingForm form={form} onSubmit={createReading} condominiumId={condominiumId} isEdit={true} />
            </Modal>
        </>
    );
});

export default EditReadingModal;