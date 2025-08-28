import { ICreateHydrometer, IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { App, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import HydrometherForm from "../Form";
import { hydrometerService } from "@/infra/services/hydromether";

interface IEditHydromeherModalProps {
    hydrometer: IHydrometer
    refresh: VoidFunction
}

const EditHydromeherModal: React.FC<IEditHydromeherModalProps> = React.memo(function EditHydromeherModal({
    hydrometer,
    refresh
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const editHydrometer = async (data: ICreateHydrometer) => {
        try {
            setLoading(true)
            await hydrometerService.update(data, hydrometer.id as string)
            refresh()
            setOpen(false)
            form.resetFields()
            notification.success({ message: 'Hidrometro', description: 'Hidrometro atualizado com sucesso' })
        } catch (error) {
            notification.error({ message: 'Hidrometro', description: error.response.data.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const { black_digits, red_digits, ...hydrometerData } = hydrometer

        form.setFieldsValue({ ...hydrometerData, black_digits: Number(black_digits), red_digits: Number(red_digits) })
    }, [hydrometer])

    return (
        <>
            <button className="text-primary cursor-pointer" onClick={() => setOpen(true)}><HiMiniPencilSquare size={18} /></button>
            <Modal open={open} onCancel={() => setOpen(false)} title="Editar hidrometro" okText="Salvar" onOk={form.submit} okButtonProps={{ size: 'large', loading: loading }} cancelButtonProps={{ size: 'large' }}>
                <HydrometherForm form={form} onSubmit={editHydrometer} />
            </Modal>
        </>
    );
});

export default EditHydromeherModal;