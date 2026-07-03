export interface Category {
    id: number;
    name: string;
    type: 'makanan' | 'minuman';
    created_at: string;
    updated_at: string;
}

export interface Menu {
    id: number;
    name: string;
    price: number;
    image: string | null;
    description?: string;
    category_id?: number;
    category?: Category;
    created_at?: string;
    updated_at?: string;
}

export interface Promo {
    id: number;
    title: string;
    menu_id: number;
    discount_type: 'percentage' | 'nominal';
    discount_value: number;
    promo_price: number;
    image: string | null;
    is_active: boolean;
    menu?: Menu;
    created_at?: string;
    updated_at?: string;
}

export interface Gallery {
    id: number;
    name: string;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ReservationPackage {
    id: number;
    name: string;
    price: number;
    price_type?: 'free' | 'per_hour';
    min_order_per_pax?: number;
    min_capacity?: number;
    max_capacity?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    payment_status: 'unpaid' | 'paid';
    issued_at: string | null;
}

export interface ReservationItem {
    id: number;
    reservation_member_id: number;
    menu_id: number;
    quantity: number;
    subtotal: number;
    menu?: Menu;
}

export interface ReservationMember {
    id: number;
    reservation_id: number;
    name: string;
    reservation_items?: ReservationItem[];
}

export interface Reservation {
    id: number;
    name: string;
    phone: string;
    reservation_date: string;
    package_id: number;
    status: 'pending' | 'approved' | 'invoiced' | 'paid' | 'completed' | 'cancelled';
    input_method: 'manual' | 'room_link';
    room_link_token: string | null;
    total_amount: number | null;
    reservation_package?: ReservationPackage;
    reservation_members?: ReservationMember[];
    invoice?: Invoice | null;
    created_at?: string;
    updated_at?: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedCollection<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
    per_page: number;
}
