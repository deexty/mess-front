import { ICreateHydrometer, IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import Masks from "@/infra/utils/Masks";
import { Flex, Form, FormInstance, Input, InputNumber } from "antd";
import React from "react";

interface IHydrometherFormProps {
    form: FormInstance;
    onSubmit?: (data: ICreateHydrometer) => void
}


const HydrometherForm: React.FC<IHydrometherFormProps> = React.memo(function HydrometherForm({
    form,
    onSubmit
}) {
    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="identifier" label="Identificador" rules={[{ required: true, message: 'Identificador é obrigatório' }]}>
                <Input size="large" max={255} />
            </Form.Item>
            <Form.Item name="reference" label="Referência">
                <Input size="large" max={255} />
            </Form.Item>
            <Form.Item name="black_digits" label="QTD. Digitos de consumo de água (m³)" rules={[{ required: true, message: 'Digitos de consumo de água (m³) é obrigatório' }, { validator: (_, value) => value !== 0 ? Promise.resolve() : Promise.reject(new Error('Digitos pretos devem ser diferente de 0')) }]}>
                <Input size="large" type="number" onChange={(e) => form.setFieldValue("black_digits", Masks.justNumbers(e.target.value))} />
            </Form.Item>
            <Form.Item name="red_digits" label="QTD. Digitos de consumo de água (L)" rules={[{ required: true, message: 'Digitos de consumo de água (L) é obrigatório' }, { validator: (_, value) => value !== 0 ? Promise.resolve() : Promise.reject(new Error('Digitos pretos devem ser diferente de 0')) }]}>
                <Input size="large" type="number" onChange={(e) => form.setFieldValue("red_digits", Masks.justNumbers(e.target.value))} />
            </Form.Item>
        </Form>
    );
});

export default HydrometherForm;