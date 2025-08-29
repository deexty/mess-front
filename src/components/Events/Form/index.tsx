import { useContracts } from "@/infra/hooks/useContracts";
import { useUsers } from "@/infra/hooks/useUsers";
import { ICreateEvent } from "@/infra/interfaces/event.interface";
import { FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import Masks from "@/infra/utils/Masks";
import useDebounce from "@/infra/utils/UseDebonce";
import { DatePicker, Form, FormInstance, Input, Select } from "antd";
import React, { useMemo, useState } from "react";

interface IEventFormProps {
    form: FormInstance
    onSubmit: (data: ICreateEvent) => void
}

const EventForm: React.FC<IEventFormProps> = React.memo(function EventForm({
    form,
    onSubmit
}) {
    const [searchUser, setSearchUser] = useState<string>("");
    const searchUserDebounced = useDebounce(searchUser, 500);
    const { users, usersLoading } = useUsers({
        page: 1,
        per_page: 100,
        filters: useMemo(() => {
            if (searchUserDebounced) {
                return [
                    {
                        filterBy: "corporate_name",
                        filterValue: searchUserDebounced,
                        filterType: FilterTypeEnum.LIKE,
                    },
                ];
            } else {
                return [];
            }
        }, [searchUserDebounced])
    })

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} className="w-full max-w-[600px]">
            <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Nome é obrigatorio' }]}>
                <Input size="large" />
            </Form.Item>
            <Form.Item name="description" label="Descricao" >
                <Input.TextArea size="large" />
            </Form.Item>
            <Form.Item
                name="user_id"
                label="Responsavel"
                rules={[{ required: true, message: 'Responsavel é obrigatorio' }]}
            >
                <Select
                    showSearch
                    size="large"
                    loading={usersLoading}
                    searchValue={searchUser}
                    onSearch={setSearchUser}
                    filterOption={false}
                    notFoundContent={usersLoading ? 'Carregando...' : 'Nenhum resultado'}
                    onChange={() => setSearchUser('')}
                    options={users?.map(c => ({
                        label: c.name,
                        value: String(c.id),
                    }))}
                />
            </Form.Item>
            <Form.Item name="date" label="Data" rules={[{ required: true, message: 'Data é obrigatorio' }]}>
                <DatePicker format="DD/MM/YYYY" size="large" showTime />
            </Form.Item>

        </Form>
    );
});

export default EventForm;