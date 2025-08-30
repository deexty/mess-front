import { CashMovementStatusEnum, ICashMovement } from "@/infra/interfaces/cashMovement.interface"
import { IContract } from "@/infra/interfaces/contract.interface"
import { ICondominium } from "@/infra/interfaces/condominium.interface"
import { userService } from "@/infra/services/user"
import Masks from "@/infra/utils/Masks"
import { App, Tag } from "antd"
import { ColumnType } from "antd/es/table"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { FaRegTrashAlt } from "react-icons/fa"
import { HiMiniPencilSquare } from "react-icons/hi2"
import EditCashMovementModal from "../Edit"
import { cashMovementService } from "@/infra/services/cashMovement"


export const cashMovementStatusMapper: Record<CashMovementStatusEnum, { label: string; color: string }> = {
    [CashMovementStatusEnum.PREDICTED]: {
        label: "Previsto",
        color: "blue",
    },
    [CashMovementStatusEnum.LATE]: {
        label: "Atrasado",
        color: "red",
    },
    [CashMovementStatusEnum.PAYED]: {
        label: "Pago",
        color: "green",
    },
};


export const CashMovementsColumns = (refresh: VoidFunction): ColumnType<ICashMovement>[] => {
    const router = useRouter()

    const { notification } = App.useApp();



    const deleteHandle = async (id: string) => {
        await cashMovementService.remove(id.toString()).then(() => {
            notification.success({
                message: 'Movimentacao',
                description: 'Movimentacao removido com sucesso'
            })
            refresh()
        }).catch(() => {
            notification.error({
                message: 'Movimentacao',
                description: 'Erro ao remover sindico'
            })
        })
    }

    return [
        {
            title: 'Valor',
            dataIndex: 'amount',
            key: 'amount',
            render(value) {
                return Masks.money(value)
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render(value) {
                return <Tag color={cashMovementStatusMapper[value as CashMovementStatusEnum].color}>{cashMovementStatusMapper[value as CashMovementStatusEnum].label}</Tag>
            }
        },
        {
            title: 'Contrato',
            dataIndex: 'contract',
            key: 'contract',
            render(value: IContract) {
                return value?.name
            }
        },
        {
            title: 'Condominio',
            dataIndex: 'contract',
            key: 'contract',
            render(value: IContract) {
                return value?.condominium?.corporate_name
            }
        },

        {
            title: 'Data de referência',
            dataIndex: 'reference_date',
            key: 'reference_date',
            render(value) {
                return dayjs(value).format('DD/MM/YYYY')
            }
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <EditCashMovementModal record={record} refresh={refresh} />
                        <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id)}><FaRegTrashAlt size={14} color="red" /></button>
                    </div>
                )
            },
        },
    ]
}