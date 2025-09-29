
export interface ProductItem {
    id: number;
    branch_id?: number;
    barcode: string;
    item_code: string;
    item_name: string;
    item_desc?: string;
    item_status: number;
    print_desc?: string;
    department_id: number;
    category_id: number;
    cost_price?: number;
    mark_up?: number;
    price: number;
    price_1?: number;
    price_2?: number;
    price_3?: number;
    price_4?: number;
    price_5?: number;
    assigned_printer?: string;
    is_disc_exempt: boolean;
    is_non_vat: boolean;
    display_image?: string;
    created_at: string;   // Use `Date` if you want to parse it with new Date()
    update_at?: string;   // or Date
}
