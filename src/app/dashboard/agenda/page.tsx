"use client";

import { Badge, Calendar, Dropdown, Drawer, Empty, MenuProps, Popconfirm, Spin, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useState } from "react";
import { useEvents } from "@/infra/hooks/useEvents";
import { MoreVertical } from "lucide-react";
import { eventService } from "@/infra/services/event";
import PageContainer from "@/components/PageContainer";
import CreateEventModal from "@/components/Events/Create";

const { Text } = Typography;

type IUser = {
    id: string;
    name: string;
    email?: string;
};

type IEvent = {
    id: string;
    name: string;
    description?: string;
    date: string;
    user_id?: string;
    user?: IUser;
};

export default function GoogleCalendarPage() {
    const { events, eventsLoading, eventsRefresh } = useEvents({
        page: 1,
        per_page: 9999,
        filters: useMemo(() => [], []),
    })

    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const eventsByDay = useMemo(() => {
        const map = new Map<string, IEvent[]>();
        for (const ev of events ?? []) {
            const d = dayjs(ev.date).format("YYYY-MM-DD");
            const arr = map.get(d) ?? [];
            arr.push(ev);
            map.set(d, arr);
        }
        for (const [key, arr] of map) {
            arr.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
            map.set(key, arr);
        }
        return map;
    }, [events]);

    const openDetails = useCallback((ev: IEvent) => {
        setSelectedEvent(ev);
        setDrawerOpen(true);
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                setDeletingId(id);
                await eventService.remove(id);
                eventsRefresh?.();
            } finally {
                setDeletingId(null);
            }
        },
        [eventsRefresh]
    );

    const itemMenu = useCallback(
        (ev: IEvent): MenuProps["items"] => [
            {
                key: "details",
                label: "Ver detalhes",
                onClick: () => openDetails(ev),
            },
            {
                key: "delete",
                label: (
                    <Popconfirm
                        title="Excluir evento?"
                        description={`Tem certeza que deseja excluir "${ev.name}"?`}
                        okText="Excluir"
                        cancelText="Cancelar"
                        onConfirm={() => handleDelete(ev.id)}
                    >
                        <Text type="danger">{deletingId === ev.id ? "Excluindo..." : "Excluir"}</Text>
                    </Popconfirm>
                ),
            },
        ],
        [deletingId, handleDelete, openDetails]
    );

    const renderDayCell = useCallback(
        (value: Dayjs) => {
            const key = value.format("YYYY-MM-DD");
            const dayEvents = eventsByDay.get(key) ?? [];

            if (!dayEvents.length) return <div style={{ minHeight: 28 }} />;

            return (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {dayEvents.map((ev) => {
                        const time = dayjs(ev.date).format("HH:mm");
                        const userName = ev.user?.name ?? ev.user_id ?? "—";
                        return (
                            <li key={ev.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <Badge status="processing" />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        title={`${ev.name} — ${time}`}
                                        style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                                        onClick={() => openDetails(ev)}
                                    >
                                        <Text strong ellipsis style={{ maxWidth: "100%" }}>
                                            {time} · {ev.name}
                                        </Text>
                                    </div>
                                    {ev.description ? (
                                        <Text type="secondary" ellipsis style={{ fontSize: 12, display: "block", lineHeight: 1.2 }}>
                                            {ev.description}
                                        </Text>
                                    ) : null}
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {userName}
                                    </Text>
                                </div>

                                <Dropdown menu={{ items: itemMenu(ev) }} trigger={["click"]}>
                                    <button
                                        aria-label="Ações"
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            padding: 4,
                                            lineHeight: 0,
                                            cursor: "pointer",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                </Dropdown>
                            </li>
                        );
                    })}
                </ul>
            );
        },
        [eventsByDay, itemMenu, openDetails]
    );

    const cellRender = (current: Dayjs, info: { type: "date" | "month" }) => {
        if (info.type === "date") return renderDayCell(current);
        return info.type === "month" ? <div /> : null;
    };

    return (
        <PageContainer header={{
            title: "Agenda",
            description: "Gerencie os eventos do condominio"
        }}
            action={<CreateEventModal refresh={eventsRefresh} />}
        >
            <Spin spinning={eventsLoading}>
                <Calendar
                    // @ts-expect-error props do AntD ainda não tipadas corretamente
                    cellRender={cellRender}
                />


                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    title={selectedEvent?.name ?? "Detalhes do dia"}
                    width={420}
                >
                    {!selectedEvent ? (
                        <Empty />
                    ) : selectedEvent.id.includes("-") ? (
                        // Drawer de 1 evento
                        <EventDetails ev={selectedEvent} onDelete={handleDelete} deletingId={deletingId} />
                    ) : (
                        // Drawer “+N mais” (lista do dia)
                        <DayEventsList
                            dateISO={selectedEvent.date}
                            events={(eventsByDay.get(dayjs(selectedEvent.date).format("YYYY-MM-DD")) ?? [])}
                            onOpen={openDetails}
                            itemMenu={itemMenu}
                        />
                    )}
                </Drawer>
            </Spin>
        </PageContainer>
    );
}

function EventDetails({
    ev,
    onDelete,
    deletingId,
}: {
    ev: IEvent;
    onDelete: (id: string) => void;
    deletingId: string | null;
}) {
    const time = dayjs(ev.date).format("DD/MM/YYYY HH:mm");
    const userName = ev.user?.name ?? ev.user_id ?? "—";
    return (
        <div style={{ display: "grid", gap: 8 }}>
            <Text type="secondary">Quando</Text>
            <Text>{time}</Text>

            <Text type="secondary" style={{ marginTop: 8 }}>
                Usuário
            </Text>
            <Text>{userName}</Text>

            {ev.description && (
                <>
                    <Text type="secondary" style={{ marginTop: 8 }}>
                        Descrição
                    </Text>
                    <Text>{ev.description}</Text>
                </>
            )}

            <div style={{ marginTop: 16 }}>
                <Popconfirm
                    title="Excluir evento?"
                    okText="Excluir"
                    cancelText="Cancelar"
                    onConfirm={() => onDelete(ev.id)}
                >
                    <button
                        style={{
                            background: "#ff4d4f",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 12px",
                            cursor: "pointer",
                        }}
                    >
                        {deletingId === ev.id ? "Excluindo..." : "Excluir"}
                    </button>
                </Popconfirm>
            </div>
        </div>
    );
}

function DayEventsList({
    dateISO,
    events,
    onOpen,
    itemMenu,
}: {
    dateISO: string;
    events: IEvent[];
    onOpen: (ev: IEvent) => void;
    itemMenu: (ev: IEvent) => MenuProps["items"];
}) {
    const dateLabel = dayjs(dateISO).format("dddd, DD/MM/YYYY");
    return (
        <div style={{ display: "grid", gap: 12 }}>
            <Text type="secondary">{dateLabel}</Text>
            {events.map((ev) => {
                const time = dayjs(ev.date).format("HH:mm");
                const userName = ev.user?.name ?? ev.user_id ?? "—";
                return (
                    <div
                        key={ev.id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            alignItems: "center",
                            gap: 8,
                            padding: 8,
                            borderRadius: 8,
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        <Badge status="processing" />
                        <div style={{ minWidth: 0 }}>
                            <Text strong style={{ display: "block" }}>
                                {time} · {ev.name}
                            </Text>
                            {ev.description && (
                                <Text type="secondary" ellipsis style={{ display: "block" }}>
                                    {ev.description}
                                </Text>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {userName}
                            </Text>
                        </div>
                        <Dropdown menu={{ items: itemMenu(ev) }} trigger={["click"]}>
                            <button
                                aria-label="Ações"
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: 4,
                                    lineHeight: 0,
                                    cursor: "pointer",
                                }}
                            >
                                ⋮
                            </button>
                        </Dropdown>
                    </div>
                );
            })}
            {!events.length && <Empty description="Sem eventos" />}
        </div>
    );
}

