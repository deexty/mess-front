import { IContract } from "@/infra/interfaces/contract.interface"
import { contractService } from "@/infra/services/contract"
import { userService } from "@/infra/services/user"
import Masks from "@/infra/utils/Masks"
import { App, Tag } from "antd"
import { ColumnType } from "antd/es/table"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { FaRegTrashAlt } from "react-icons/fa"
import { HiMiniPencilSquare } from "react-icons/hi2"
import { IoEyeOutline } from "react-icons/io5"

export const ContractColumns = (refresh: VoidFunction): ColumnType<IContract>[] => {
    const router = useRouter()

    const { notification } = App.useApp();

    const deleteHandle = async (id: string) => {
        await contractService.remove(id.toString()).then(() => {
            notification.success({
                message: 'Contrato',
                description: 'Contrato removido com sucesso'
            })
            refresh()
        }).catch(() => {
            notification.error({
                message: 'Contrato',
                description: 'Erro ao remover sindico'
            })
        })
    }

    return [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Condominio',
            dataIndex: 'condominium',
            key: 'condominium',
            render(value) {
                return value?.corporate_name
            }
        },
        {
            title: 'Status',
            render(value) {
                const isExpired = dayjs(value.expiration_date).isBefore(dayjs())

                return <Tag color={isExpired ? 'red' : 'green'}>{isExpired ? 'Vencido' : 'Ativo'}</Tag>
            }
        },
        {
            title: 'QTD. unidades',
            dataIndex: 'unit_qtd',
            key: 'unit_qtd',
        },
        {
            title: 'Comissão',
            dataIndex: 'comission',
            key: 'comission',
            render(value) {
                return Masks.money(value)
            }
        },
        {
            title: 'Valor mensal',
            dataIndex: 'month_value',
            key: 'month_value',
            render(value) {
                return Masks.money(value)
            }
        },
        {
            title: 'Data de vencimento',
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            render(value) {
                return dayjs(value).format('DD/MM/YYYY')
            }
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <button className="text-primary cursor-pointer" onClick={() => router.push(`/dashboard/contratos/visualizar/${record.id}`)}><IoEyeOutline size={18} /></button>
                        <button className="text-primary cursor-pointer" onClick={() => router.push(`/dashboard/contratos/editar/${record.id}`)}><HiMiniPencilSquare size={18} /></button>
                        <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id)}><FaRegTrashAlt size={14} color="red" /></button>
                    </div>
                )
            },
        },
    ]
}