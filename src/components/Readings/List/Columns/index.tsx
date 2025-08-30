import { IReading, ReadingStatusMapper } from "@/infra/interfaces/reading.interface"
import { Tag } from "antd"
import { ColumnType } from "antd/es/table"
import dayjs from "dayjs"
import EditReadingModal from "../../Edit"

export const ReadingColumn = (refresh: VoidFunction): ColumnType<IReading>[] => {
    return [
        {
            title: "Data de Referência",
            dataIndex: "reference_date",
            key: "reference_date",
            render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: IReading["status"]) => {
                const colors: Record<IReading["status"], string> = {
                    pending: "orange",
                    processed: "green",
                    errored: "red",
                    in_progress: "blue",
                    review_needed: "purple",
                }
                return <Tag color={colors[status]} key={status}>{ReadingStatusMapper[status as keyof typeof ReadingStatusMapper]}</Tag>
            },
        },
        {
            title: "Hidrometro",
            render: (_, record) => record?.hydrometer?.identifier ?? record?.qr_code_result,
        },
        {
            title: "Leitura (L)",
            dataIndex: "red_digits",
            key: "red_digits",
        },
        {
            title: "Leitura (m³)",
            dataIndex: "black_digits",
            key: "black_digits",
        },
        {
            title: "Observações",
            dataIndex: "review_reasons",
            key: "review_reasons",
        },
        {
            title: "Erro",
            dataIndex: "error_message",
            key: "error_message",
            render: (error?: string) => error ?? "-",
        },
        {
            render: (_, record) => (
                <EditReadingModal refresh={refresh} record={record} />
            )
        }
    ]
}
