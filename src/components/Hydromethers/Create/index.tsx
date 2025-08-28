import { ICreateHydrometer, IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { App, Button, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import HydrometherForm from "../Form";
import { hydrometerService } from "@/infra/services/hydromether";
import { GoPlus } from "react-icons/go";

interface ICreateHydrometherModalProps {
    refresh: VoidFunction,
    condominiumId: string
}

const CreateHydrometherModal: React.FC<ICreateHydrometherModalProps> = React.memo(function CreateHydrometherModal({
    refresh,
    condominiumId
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    const { notification } = App.useApp()

    const createHydrometer = async (data: ICreateHydrometer) => {
        try {
            setLoading(true)
            await hydrometerService.create({ ...data, condominium_id: condominiumId })
            refresh()
            setOpen(false)
            form.resetFields()
            notification.success({ message: 'Hidrometro', description: 'Hidrometro criado com sucesso' })
        } catch (error) {
            notification.error({ message: 'Hidrometro', description: error.response.data.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<GoPlus />} size="large" type="primary">Criar hidrometro</Button>
            <Modal open={open} onCancel={() => {
                setOpen(false)
                form.resetFields()
            }} title="Criar hidrometro" okText="Salvar" onOk={form.submit} okButtonProps={{ size: 'large', loading: loading }} cancelButtonProps={{ size: 'large' }}>
                <HydrometherForm form={form} onSubmit={createHydrometer} />
            </Modal>
        </>
    );
});

export default CreateHydrometherModal;