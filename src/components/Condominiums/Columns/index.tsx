import { useAuth } from "@/contexts/useAuth"
import { ICondominium } from "@/infra/interfaces/condominium.interface"
import { IUserType } from "@/infra/interfaces/user.interface"
import { condominiumService } from "@/infra/services/condominium"
import { App } from "antd"
import { ColumnType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { FaRegTrashAlt } from "react-icons/fa"
import { HiMiniPencilSquare } from "react-icons/hi2"
import { IoEyeOutline } from "react-icons/io5"

export const CondominiumColumns = (refresh: VoidFunction,): ColumnType<ICondominium>[] => {
    const router = useRouter()
    const { user } = useAuth()

    const { notification, modal } = App.useApp();

    const deleteHandle = async (id: number) => {
        modal.confirm({
            okText: 'Excluir',
            centered: true,
            title: 'Deseja realmente excluir esse condominio?',
            onOk: async () => {
                await condominiumService.remove(id.toString()).then(() => {
                    notification.success({
                        message: 'Condominium',
                        description: 'Condominium removido com sucesso'
                    })
                    refresh()
                }).catch(() => {
                    notification.error({
                        message: 'Condominium',
                        description: 'Erro ao remover condominium'
                    })
                })
            }
        })
    }

    return [
        {
            title: 'Nome do condomínio',
            dataIndex: 'corporate_name',
            key: 'corporate_name',
        },
        {
            title: 'CNPJ',
            dataIndex: 'cnpj',
            key: 'cnpj',
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <button className="text-primary cursor-pointer" onClick={() => router.push(`/dashboard/condominios/visualizar/${record.id}`)}><IoEyeOutline size={18} /></button>
                        {user?.role === IUserType.ADMIN && <button className="text-primary cursor-pointer" onClick={() => router.push(`/dashboard/condominios/editar/${record.id}`)}><HiMiniPencilSquare size={18} /></button>}
                        {user?.role === IUserType.ADMIN && <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id)}><FaRegTrashAlt size={14} color="red" /></button>}
                    </div>
                )
            },
        },
    ]
}