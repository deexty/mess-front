import { useEffect, useState } from "react"
import { App } from "antd"
import { condominiumService } from "../services/condominium"
import { ICondominium } from "../interfaces/condominium.interface"

export const useCondominium = (id: string) => {
    const [condominium, setCondominium] = useState<ICondominium>()
    const [loadingCondominium, setLoadingCondominium] = useState<boolean>(false)
    const { notification } = App.useApp();

    const fetchCondominium = async () => {
        if (loadingCondominium) return

        await condominiumService.getOne(id).then(({ data }) => {
            setCondominium(data)
        })
            .catch((error) => notification.error({ message: 'Condominium', description: error.response.data.message }))
            .finally(() => setLoadingCondominium(false))
    }

    useEffect(() => {
        if (!id) return

        fetchCondominium()
    }, [id])

    return {
        condominium,
        loadingCondominium,
        fetchCondominium
    }
}