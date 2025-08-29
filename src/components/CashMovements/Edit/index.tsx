import { ICreateCashMovement, ICashMovement } from "@/infra/interfaces/cashMovement.interface";
import { App, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import CashMovementForm from "../Form";
import { authService } from "@/infra/services/auth";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { cashMovementService } from "@/infra/services/cashMovement";
import Masks from "@/infra/utils/Masks";
import dayjs from "dayjs";

interface ICashMovementFormProps {
    refresh: VoidFunction,
    record: ICashMovement
}

const EditCashMovementModal: React.FC<ICashMovementFormProps> = React.memo(function EditCashMovementModal({
    refresh,
    record
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()
    const { notification } = App.useApp()

    const editCashMovementHandle = async (data: ICreateCashMovement) => {
        if (loading) return

        setLoading(true)

        await cashMovementService.update({ ...data, amount: Masks.clearMoney(String(data.amount)) }, record.id).then(() => {
            setOpen(false)
            form.resetFields()
            refresh()
            notification.success({ message: 'Movimentação', description: 'Movimentação editado com sucesso' })
        }).catch((error) => {
            notification.error({ message: 'Movimentação', description: error.response.data.message })
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                ...record,
                reference_date: record.reference_date ? dayjs(record.reference_date) : null
            })
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
                title="Editar movimentação"
            >
                <CashMovementForm form={form} onSubmit={editCashMovementHandle} />
            </Modal>
        </>
    );
});

export default EditCashMovementModal;