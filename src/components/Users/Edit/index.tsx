import { ICreateUser, IUser, IUserType } from "@/infra/interfaces/user.interface";
import { App, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import UserForm from "../Form";
import { authService } from "@/infra/services/auth";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { userService } from "@/infra/services/user";

interface IUserFormProps {
    refresh: VoidFunction,
    record: IUser
}

const EditSindicModal: React.FC<IUserFormProps> = React.memo(function EditSindicModal({
    refresh,
    record
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()
    const { notification } = App.useApp()

    const editUserHandle = async (data: ICreateUser) => {
        if (loading) return

        setLoading(true)

        await userService.update({ ...data, role: IUserType.SYNDIC }, record.id).then(() => {
            setOpen(false)
            form.resetFields()
            refresh()
            notification.success({ message: 'Usuario', description: 'Usuario editado com sucesso' })
        }).catch((error) => {
            notification.error({ message: 'Usuario', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (record) {
            form.setFieldsValue(record)
        }
    }, [record])

    return (
        <>
            <button className="text-primary cursor-pointer" onClick={() => setOpen(true)}><HiMiniPencilSquare size={18} /></button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }}
                okText="Salvar"
                onOk={form.submit}
                okButtonProps={{ size: 'large', loading }}
                cancelButtonProps={{ size: 'large' }}
                title="Editar usuario"
            >
                <UserForm form={form} onSubmit={editUserHandle} />
            </Modal>
        </>
    );
});

export default EditSindicModal;