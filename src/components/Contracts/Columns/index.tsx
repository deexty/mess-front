import { IContract } from "@/infra/interfaces/contract.interface"
import { userService } from "@/infra/services/user"
import Masks from "@/infra/utils/Masks"
import { App } from "antd"
import { ColumnType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { FaRegTrashAlt } from "react-icons/fa"
import { HiMiniPencilSquare } from "react-icons/hi2"

export const ContractColumns = (refresh: VoidFunction): ColumnType<IContract>[] => {
    const router = useRouter()

    const { notification } = App.useApp();

    const deleteHandle = async (id: string) => {
        await userService.remove(id.toString()).then(() => {
            notification.success({
                message: 'Sindico',
                description: 'Sindico removido com sucesso'
            })
            refresh()
        }).catch(() => {
            notification.error({
                message: 'Sindico',
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
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <button className="text-primary cursor-pointer" onClick={() => router.push(`/dashboard/contratos/editar/${record.id}`)}><HiMiniPencilSquare size={18} /></button>
                        <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id)}><FaRegTrashAlt size={14} color="red" /></button>
                    </div>
                )
            },
        },
    ]
}