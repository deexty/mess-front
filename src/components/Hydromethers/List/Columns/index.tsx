import { IHydrometer } from "@/infra/interfaces/hydrometer.interface";
import { ColumnType } from "antd/es/table";
import { FaRegTrashAlt } from "react-icons/fa";
import EditHydromeherModal from "../../Edit";
import { hydrometerService } from "@/infra/services/hydromether";
import { App } from "antd";

export const HydrometherColumn = (refresh: VoidFunction): ColumnType<IHydrometer>[] => {
    const { notification } = App.useApp();

    const deleteHandle = async (id: string) => {
        await hydrometerService.remove(id.toString()).then(() => {
            notification.success({
                message: 'Hidrometro',
                description: 'Hidrometro removido com sucesso'
            })
            refresh()
        }).catch(() => {
            notification.error({
                message: 'Hidrometro',
                description: 'Erro ao remover hidrometro'
            })
        })
    }

    return [
        {
            title: "Identificador",
            dataIndex: "identifier",
            key: "identifier",
        },
        {
            title: "Referência",
            dataIndex: "reference",
            key: "reference",
        },
        {
            title: "QTD. Digitos de consumo de água (m³)",
            dataIndex: "black_digits",
            key: "black_digits",
        },
        {
            title: "QTD. Digitos de consumo de água (L)",
            dataIndex: "red_digits",
            key: "red_digits",
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <EditHydromeherModal hydrometer={record} refresh={refresh} />
                        <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id as string)}><FaRegTrashAlt size={14} color="red" /></button>
                    </div>
                )
            },
        },
    ];
};