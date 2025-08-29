import { ICreateUser } from "@/infra/interfaces/user.interface";
import Masks from "@/infra/utils/Masks";
import { Form, FormInstance, Input } from "antd";
import React from "react";

interface IUserFormProps {
    form: FormInstance
    onSubmit: (data: ICreateUser) => void
}

const UserForm: React.FC<IUserFormProps> = React.memo(function UserForm({
    form,
    onSubmit
}) {
    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Nome é obrigatório' }]}>
                <Input size="large" max={255} />
            </Form.Item>
            <Form.Item name="login" label="Email" rules={[{ required: true, message: 'Email é obrigatório' }]}>
                <Input size="large" max={255} />
            </Form.Item>
            <Form.Item name="phone" label="Telefone" rules={[{ required: true, message: 'Telefone é obrigatório' }]}>
                <Input size="large" max={255} onChange={(e) => form.setFieldValue("phone", Masks.phone(e.target.value))} />
            </Form.Item>
            <Form.Item name="document" label="Documento" rules={[{ required: true, message: 'Documento é obrigatório' }]}>
                <Input size="large" max={255} onChange={(e) => form.setFieldValue("document", Masks.cpf(e.target.value))} />
            </Form.Item>
            <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Senha é obrigatório' }]}>
                <Input.Password size="large" max={255} />
            </Form.Item>
        </Form>
    );
});

export default UserForm;