import { ICondominium } from "@/infra/interfaces/condominium.interface"
import { IUser } from "@/infra/interfaces/user.interface"
import { condominiumService } from "@/infra/services/condominium"
import { userService } from "@/infra/services/user"
import Masks from "@/infra/utils/Masks"
import { App } from "antd"
import { ColumnType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { FaRegTrashAlt } from "react-icons/fa"
import { HiMiniPencilSquare } from "react-icons/hi2"
import { IoEyeOutline } from "react-icons/io5"
import EditSindicModal from "../Edit"

export const UserColumns = (refresh: VoidFunction): ColumnType<IUser>[] => {
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
            title: 'Login',
            dataIndex: 'login',
            key: 'login',
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            render(value) {
                return Masks.phone(value)
            }
        },
        {
            title: 'Documento',
            dataIndex: 'document',
            key: 'document',
            render(value) {
                return Masks.cpf(value)
            }
        },
        {
            width: 100,
            render(value, record, index) {
                return (
                    <div className="flex gap-4">
                        <EditSindicModal refresh={refresh} record={record} />
                        <button className="text-primary cursor-pointer" onClick={() => deleteHandle(record.id)}><FaRegTrashAlt size={14} color="red" /></button>
                    </div>
                )
            },
        },
    ]
}