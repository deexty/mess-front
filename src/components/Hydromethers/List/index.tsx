import { useHydrometers } from "@/infra/hooks/useHydrometers";
import { FilterTypeEnum, IParseFilter } from "@/infra/interfaces/parse-filters";
import useDebounce from "@/infra/utils/UseDebonce";
import { App, Button, Input, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HydrometherColumn } from "./Columns";
import CreateHydrometherModal from "../Create";
import CreateReadingModal from "@/components/Readings/Create";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import ReactDOM from "react-dom/client";
import { hydrometerService } from "@/infra/services/hydromether";
import { IoQrCodeOutline } from "react-icons/io5";
import UploadHydrometersModal from "../Upload";

interface IListHydromethersProps {
    condominiumId?: string
}

const ListHydromethers: React.FC<IListHydromethersProps> = React.memo(function ListHydromethers({
    condominiumId
}) {
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<IParseFilter[]>([])
    const [searchText, setSearchText] = useState<string>("")
    const searchTextDebounced = useDebounce(searchText, 500)
    const { notification } = App.useApp()

    const { hydrometers, hydrometersTotal, hydrometersLoading, hydrometersRefresh } = useHydrometers({
        page: useMemo(() => page, [page]),
        per_page: 10,
        filters: useMemo(() => [
            {
                filterBy: "condominium_id",
                filterValue: condominiumId as string,
                filterType: FilterTypeEnum.EQUAL
            }, ...filters
        ], [filters]),
        canExecute: !!condominiumId
    })

    useEffect(() => {
        const newFilters: IParseFilter[] = []



        if (searchTextDebounced) {
            newFilters.push({
                filterBy: "identifier",
                filterValue: searchTextDebounced,
                filterType: FilterTypeEnum.LIKE
            })
        }

        setFilters(newFilters)
    }, [searchTextDebounced])

    const generateQRCodeDataURL = useCallback(
        (value: string, size: number): Promise<string> => {
            return new Promise(resolve => {
                const container = document.createElement("div");
                const root = ReactDOM.createRoot(container);

                root.render(
                    <QRCodeCanvas
                        value={value}
                        size={size}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                    />
                );

                setTimeout(() => {
                    const canvas = container.querySelector("canvas");
                    if (canvas) {
                        resolve(canvas.toDataURL("image/png"));
                    } else {
                        resolve("");
                    }
                    root.unmount();
                    container.remove();
                }, 100);
            });
        },
        []
    );


    const handleExportQRCode = useCallback(async () => {
        const hydrometers = await hydrometerService.getAllWithoutPagination();

        if (!hydrometers?.length) {
            notification.info({
                message: "Nenhum hidrômetro para exportar",
                description: "Não há hidrômetros na lista para gerar QR Codes.",
            });
            return;
        }

        const doc = new jsPDF();

        const margin = 10;
        const cellPadding = 4;
        const qrSize = 36;
        const labelHeight = 6;
        const labelGap = 2;

        const cellWidth = qrSize + cellPadding * 2;
        const cellHeight = qrSize + labelGap + labelHeight + cellPadding * 2;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const cols = Math.max(1, Math.floor((pageWidth - margin * 2) / cellWidth));
        const rows = Math.max(1, Math.floor((pageHeight - margin * 2) / cellHeight));
        const perPage = cols * rows;

        const mmToPx = (mm: number) => mm * 3.77953;

        const drawCutBorder = (x: number, y: number) => {
            doc.setDrawColor(255, 0, 0);
            doc.setLineWidth(0.4);
            doc.rect(x, y, cellWidth, cellHeight);
        };

        doc.setFont("helvetica", "normal");

        for (let i = 0; i < hydrometers.length; i++) {
            const pageIndex = Math.floor(i / perPage);
            const indexInPage = i % perPage;

            if (indexInPage === 0 && pageIndex > 0) {
                doc.addPage();
            }

            const row = Math.floor(indexInPage / cols);
            const col = indexInPage % cols;

            const cellX = margin + col * cellWidth;
            const cellY = margin + row * cellHeight;

            const hydrometer = hydrometers[i];
            const identifier = String(hydrometer.identifier ?? "");

            try {
                const imgData = await generateQRCodeDataURL(
                    identifier,
                    mmToPx(qrSize)
                );

                drawCutBorder(cellX, cellY);

                const qrX = cellX + cellPadding;
                const qrY = cellY + cellPadding;

                doc.addImage(imgData, "PNG", qrX, qrY, qrSize, qrSize);

                const textY = qrY + qrSize + labelGap + labelHeight * 0.75;

                let fontSize = 10;
                doc.setFontSize(fontSize);
                let textWidth = doc.getTextWidth(identifier);
                const maxTextWidth = cellWidth - cellPadding * 2;

                while (textWidth > maxTextWidth && fontSize > 6) {
                    fontSize -= 1;
                    doc.setFontSize(fontSize);
                    textWidth = doc.getTextWidth(identifier);
                }

                const textX = cellX + (cellWidth - textWidth) / 2;
                doc.text(identifier, textX, textY);
            } catch (error) {
                console.error(error);
                notification.error({
                    message: "Erro ao gerar QR Code",
                    description: `Não foi possível gerar o QR Code para o hidrômetro ${identifier}.`,
                });
            }
        }

        doc.save("qrcodes_hidrometros.pdf");
    }, [hydrometerService, generateQRCodeDataURL]);



    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 justify-between items-center">
                <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por identificador" className="flex-1 max-w-1/3" size="large" />
                <div className="flex gap-4 items-center">
                    <Button onClick={handleExportQRCode} icon={<IoQrCodeOutline />} size="large" >Exportar QR Codes</Button>
                    <CreateReadingModal condominiumId={condominiumId as string} />
                    <UploadHydrometersModal refresh={hydrometersRefresh} condominiumId={condominiumId as string} />
                    <CreateHydrometherModal refresh={hydrometersRefresh} condominiumId={condominiumId as string} />
                </div>

            </div>
            <Table dataSource={hydrometers} pagination={
                {
                    total: hydrometersTotal,
                    current: page,
                    onChange(page, _pageSize) {

                        setPage(page)
                    },
                }
            }
                loading={hydrometersLoading}
                columns={HydrometherColumn(hydrometersRefresh)}
            />
        </div>
    );
});

export default ListHydromethers;