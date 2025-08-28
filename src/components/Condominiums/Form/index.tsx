'use client'

import { useUsers } from "@/infra/hooks/useUsers";
import { ICreateCondominium } from "@/infra/interfaces/condominium.interface";
import { FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import { IUserType } from "@/infra/interfaces/user.interface";
import Masks from "@/infra/utils/Masks";
import { Button, Divider, Flex, Form, FormInstance, Input, Select } from "antd";
import React, { useMemo } from "react";

interface ICondominiumsFormProps {
    form: FormInstance
    isView?: boolean
    onSubmit?: (data: ICreateCondominium) => void
}

const CondominiumsForm: React.FC<ICondominiumsFormProps> = React.memo(function CondominiumsForm({
    form,
    isView, onSubmit
}) {

    const { users, usersLoading } = useUsers({
        page: 1,
        per_page: 9999,
        canExecute: true,
        filters: useMemo(() => [
            {
                filterBy: 'role',
                filterValue: IUserType.SYNDIC,
                filterType: FilterTypeEnum.EQUAL
            }
        ], [])
    })

    return (
        <Form className="w-full" layout="vertical" form={form} disabled={isView} onFinish={onSubmit}>
            <Flex className="w-full" gap={32}>
                <Flex vertical className="flex-1" >
                    <Form.Item name={"corporate_name"} label='Razão social' rules={[{ required: true, message: 'Razão social é obrigatório' }]}>
                        <Input size="large" max={255} />
                    </Form.Item>
                    <Flex className="flex-1" gap={16}>
                        <Form.Item name="cnpj" className="flex-1" label="CNPJ" rules={[{ required: true, message: 'CNPJ é obrigatório' }]}>
                            <Input size="large" onChange={(e) => {
                                form.setFieldValue("cnpj", Masks.cnpj(e.target.value))
                            }} />
                        </Form.Item>
                        <Form.Item name={"units"} className="flex-1" label="Unidades">
                            <Input size="large" onChange={(e) => form.setFieldValue("units", Masks.justNumbers(e.target.value))} />
                        </Form.Item>
                    </Flex>
                </Flex>
                <Flex vertical className="flex-1" >
                    <Form.Item name={"trade_name"} className="flex-1" label="Nome fantasia">
                        <Input size="large" max={255} />
                    </Form.Item>
                    <Flex className="flex-1" gap={16}>
                        <Form.Item name={"phone"} className="flex-1 max-w-1/2" label="Telefone">
                            <Input size="large" onChange={(e) => form.setFieldValue("phone", Masks.phone(e.target.value))} />
                        </Form.Item>
                    </Flex>
                </Flex>
            </Flex>
            <Divider orientation="left">Endereço</Divider>
            <Flex className="w-full" gap={32}>
                <Flex vertical className="flex-1" >
                    <Form.Item name={"address"} label="Endereço">
                        <Input size="large" />
                    </Form.Item>
                    <Flex className="flex-1" gap={16}>
                        <Form.Item name={"cep"} className="flex-1" label="CEP">
                            <Input size="large" onChange={(e) => form.setFieldValue("cep", Masks.cep(e.target.value))} />
                        </Form.Item>
                        <Form.Item name={"city"} className="flex-1" label="Cidade">
                            <Input size="large" />
                        </Form.Item>
                    </Flex>
                </Flex>
                <Flex vertical className="flex-1" >
                    <Form.Item name={"complement"} label="Complemento">
                        <Input size="large" />
                    </Form.Item>
                    <Flex className="flex-1" gap={16}>
                        <Form.Item name={"state"} className="flex-1" label="Estado">
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name={"reference"} className="flex-1" label="Referência">
                            <Input size="large" />
                        </Form.Item>
                    </Flex>
                </Flex>
            </Flex>
            <Divider orientation="left">Geral</Divider>
            <Flex className="w-full" gap={32}>
                <Flex vertical className="flex-1" >
                    <Form.Item name={"syndic_id"} label="Sindico" rules={[{ required: true, message: 'Sindico é obrigatório' }]}>
                        <Select size="large" loading={usersLoading} options={users?.map((user) => ({ label: user.name, value: user.id }))} />
                    </Form.Item>
                    {/* <Flex className="flex-1" gap={16}>
                        <Form.Item name={"name"} className="flex-1" label="Tronco">
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name={"name"} className="flex-1" label="Modalidade">
                            <Input size="large" />
                        </Form.Item>z
                    </Flex> */}
                </Flex>
                {/* <Flex vertical className="flex-1" >
                    <Flex className="flex-1" gap={16}>
                        <Form.Item name={"name"} className="flex-1" label="Unidade de leitura" >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name={"name"} className="flex-1" label="Tipo de medição">
                            <Input size="large" />
                        </Form.Item>
                    </Flex>
                </Flex> */}
            </Flex>


        </Form >
    );
});

export default CondominiumsForm;