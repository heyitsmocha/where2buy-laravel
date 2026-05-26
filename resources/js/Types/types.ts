export interface Inquiry {
    id: number;
    user_id: number;
    item_id: number;
    location: [number, number];
    search_radius_meters: number;
}

export interface Item {
    id: number;
    name: string;
    description?: string;
}

export interface Answer {
    id: number;
    inquiry_id: number;
    user_id: number;
    location: [number, number];
    store_name: string;
    store_address?: string;
}
