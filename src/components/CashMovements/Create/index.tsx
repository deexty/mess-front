import { App, Button, Form, Modal } from "antd";
import React, { useState } from "react";
import CashMovementForm from "../Form";
import { ICreateCashMovement } from "@/infra/interfaces/cashMovement.interface";
import { cashMovementService } from "@/infra/services/cashMovement";
import Masks from "@/infra/utils/Masks";

interface ICashMovementFormProps {
    refresh: VoidFunction
}

const CreateCashMovementModal: React.FC<ICashMovementFormProps> = React.memo(function CreateCashMovementModal({
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()
    const { notification } = App.useApp()

    const createCashMovementHandle = async (data: ICreateCashMovement) => {
        if (loading) return

        setLoading(true)

        await cashMovementService.create({ ...data, amount: Masks.clearMoney(String(data.amount)) }).then(() => {
            setOpen(false)
            form.resetFields()
            refresh()
            notification.success({ message: 'Movimentação', description: 'Movimentação criada com sucesso' })
        }).catch((error) => {
            notification.error({ message: 'Movimentação', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>Criar movimentação</Button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }}
                okText="Salvar"
                onOk={form.submit}
                okButtonProps={{ size: 'large', loading }}
                cancelButtonProps={{ size: 'large' }}
                title="Criar movimentação"
            >
                <CashMovementForm form={form} onSubmit={createCashMovementHandle} />
            </Modal>
        </>
    );
});

export default CreateCashMovementModal;