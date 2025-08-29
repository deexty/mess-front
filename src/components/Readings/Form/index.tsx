import { useHydrometers } from "@/infra/hooks/useHydrometers";
import { FilterTypeEnum } from "@/infra/interfaces/parse-filters";
import Masks from "@/infra/utils/Masks";
import { Button, DatePicker, Flex, Form, FormInstance, Image, Input, Select, Upload } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { ICreateReading } from "@/infra/interfaces/reading.interface";

interface IReadingFormProps {
    form: FormInstance,
    onSubmit?: (data: ICreateReading) => void,
    condominiumId?: string
}

const ReadingForm: React.FC<IReadingFormProps> = React.memo(function ReadingForm({
    form,
    onSubmit,
    condominiumId,
}) {
    const [selectedHydrometer, setSelectedHydrometer] = useState<IHydrometer>();

    const { hydrometers, hydrometersLoading } = useHydrometers({
        page: 1,
        per_page: 9999,
        filters: useMemo(() => {
            if (condominiumId) {
                return [
                    {
                        filterBy: "condominium_id",
                        filterValue: condominiumId,
                        filterType: FilterTypeEnum.EQUAL
                    }
                ]
            }
            return []
        }, [])
    })

    const file = Form.useWatch('file', form);
    const previewUrl = React.useMemo(() => {
        if (!file) return undefined;
        if (typeof file === "string") return file;
        if (file instanceof File) return URL.createObjectURL(file);
        return undefined;
    }, [file]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);


    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} >
            <Form.Item name='qr_code_result' label="Hidrometro" rules={[{ required: true, message: 'Hidrometro é obrigatório' }]}>
                <Select size="large" loading={hydrometersLoading} options={hydrometers?.map((hydrometer) => ({ label: hydrometer.identifier, value: hydrometer.identifier }))} onChange={(value) => setSelectedHydrometer(hydrometers?.find((hydrometer) => hydrometer.identifier === value))} />
            </Form.Item>
            <Form.Item name="black_digits" label="Digitos de consumo de água (m³)" rules={[{ required: true, message: 'Digitos de consumo de água (m³) é obrigatório' }]}>
                <Input size="large" type="number" onChange={(e) => form.setFieldValue("black_digits", Masks.justNumbers(e.target.value))} />
            </Form.Item>
            <Form.Item name="red_digits" label="Digitos de consumo de água (L)" rules={[{ required: true, message: 'Digitos de consumo de água (L) é obrigatório' },]}>
                <Input size="large" type="number" onChange={(e) => form.setFieldValue("red_digits", Masks.justNumbers(e.target.value))} />
            </Form.Item>
            <Form.Item
                name="reference_date"
                label="Data de referência"
                rules={[{ required: true, message: "Data de referência é obrigatória" }]}
            >
                <DatePicker format="DD/MM/YYYY" size="large" />
            </Form.Item>
            <Form.Item name="file" label="Arquivo de leitura" rules={[{ required: true, message: 'Arquivo de leitura é obrigatório' }]}>
                <Flex vertical gap={16}>
                    <Upload
                        accept="image/*"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={(info) => {
                            const f = info.file.originFileObj ?? info.file;
                            form.setFieldValue("file", f);
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} className="w-full">
                            Selecionar arquivo de leitura
                        </Button>
                    </Upload>
                    {previewUrl && <Image width={200} src={previewUrl} />}
                </Flex>
            </Form.Item>
        </Form>
    );
});

export default ReadingForm;