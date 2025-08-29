import { ICreateUser, IUserType } from "@/infra/interfaces/user.interface";
import { App, Button, Form, Modal } from "antd";
import React, { useState } from "react";
import UserForm from "../Form";
import { authService } from "@/infra/services/auth";

interface IUserFormProps {
    refresh: VoidFunction
}

const CreateSindicModal: React.FC<IUserFormProps> = React.memo(function CreateSindicModal({
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()
    const { notification } = App.useApp()

    const createUserHandle = async (data: ICreateUser) => {
        if (loading) return

        setLoading(true)

        await authService.register({ ...data, role: IUserType.SYNDIC }).then(() => {
            setOpen(false)
            form.resetFields()
            refresh()
            notification.success({ message: 'Sindico', description: 'Sindico criado com sucesso' })
        }).catch((error) => {
            notification.error({ message: 'Sindico', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>Criar sindico</Button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }}
                okText="Salvar"
                onOk={form.submit}
                okButtonProps={{ size: 'large', loading }}
                cancelButtonProps={{ size: 'large' }}
                title="Criar sindico"
            >
                <UserForm form={form} onSubmit={createUserHandle} />
            </Modal>
        </>
    );
});

export default CreateSindicModal;