export interface ProductOrder {
  barcode: string;
  item_name: string;
  print_desc?: string;
  price: number;
  quantity: number;
  modifier: string[];
  assigned_printer?: string;
  note?: string;
  is_disc_exempt: boolean;
  is_non_vat: boolean;
  display_image?: string;
}
