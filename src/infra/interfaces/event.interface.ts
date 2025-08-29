export interface IEvent {
    id: string
    name: string;
    description: string;
    date: string;
    user_id: string;
}

export interface ICreateEvent {
    name: string;
    description: string;
    date: string;
    user_id: string;
}
