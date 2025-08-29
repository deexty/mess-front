import { App, Button, Form, Modal } from "antd";
import React, { useState } from "react";
import EventForm from "../Form";
import { ICreateEvent } from "@/infra/interfaces/event.interface";
import { eventService } from "@/infra/services/event";

interface IEventFormProps {
    refresh: VoidFunction
}

const CreateEventModal: React.FC<IEventFormProps> = React.memo(function CreateEventModal({
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()
    const { notification } = App.useApp()

    const createEventHandle = async (data: ICreateEvent) => {
        if (loading) return

        setLoading(true)

        await eventService.create(data).then(() => {
            setOpen(false)
            form.resetFields()
            refresh()
            notification.success({ message: 'Evento', description: 'Evento criada com sucesso' })
        }).catch((error) => {
            notification.error({ message: 'Evento', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>Criar evento</Button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }}
                okText="Salvar"
                onOk={form.submit}
                okButtonProps={{ size: 'large', loading }}
                cancelButtonProps={{ size: 'large' }}
                title="Criar evento"
            >
                <EventForm form={form} onSubmit={createEventHandle} />
            </Modal>
        </>
    );
});

export default CreateEventModal;