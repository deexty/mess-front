import { useEffect, useState } from "react"
import { App } from "antd"
import { contractService } from "../services/contract"
import { IContract } from "../interfaces/contract.interface"

export const useContract = (id: string) => {
    const [contract, setContract] = useState<IContract>()
    const [loadingContract, setLoadingContract] = useState<boolean>(false)
    const { notification } = App.useApp();

    const fetchContract = async () => {
        if (loadingContract) return

        await contractService.getOne(id).then(({ data }) => {
            setContract(data)
        })
            .catch((error) => notification.error({ message: 'Contract', description: error.response.data.message }))
            .finally(() => setLoadingContract(false))
    }

    useEffect(() => {
        if (!id) return

        fetchContract()
    }, [id])

    return {
        contract,
        loadingContract,
        fetchContract
    }
}