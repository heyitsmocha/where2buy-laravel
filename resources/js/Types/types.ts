export interface Inquiry {
  id: number;
  created_at: string;
  item_id: number;
  item_name: string;
  latitude: number;
  longitude: number;
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
  latitude: number;
  longitude: number;
  store_name: string;
  store_address?: string;
}

export type SharedProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
  sidebar: {
    state: boolean;
  }
}
