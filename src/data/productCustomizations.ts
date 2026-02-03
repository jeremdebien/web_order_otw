export interface CustomizationOption {
    label: string;
    price: number;
    barcode: string;
}

export interface CustomizationGroup {
    name: string;
    min: number;
    max: number;
    options: CustomizationOption[];
}

export const productCustomizations: Record<string, CustomizationGroup[]> = {
    // Barcodes
    // Large
    'p0002': [
        {
            name: 'Flavor',
            min: 1,
            max: 1,
            options: [
                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ],
    // Jumbo
    'p0003': [
        {
            name: 'Flavor',
            min: 1,
            max: 2,
            options: [

                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ],
    // Mega
    'p0004': [
        {
            name: 'Flavor',
            min: 1,
            max: 2,
            options: [

                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ],
    // Giga
    'p0005': [
        {
            name: 'Flavor',
            min: 1,
            max: 2,
            options: [

                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ],
    // Regular
    'p001': [
        {
            name: 'Flavor',
            min: 1,
            max: 1,
            options: [

                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ],
    //Tera
    'p006': [
        {
            name: 'Flavor',
            min: 1,
            max: 3,
            options: [

                { label: 'Cheese', price: 0, barcode: 'p0007' },
                { label: 'BBQ', price: 0, barcode: 'p0008' },
                { label: 'Sour Cream', price: 0, barcode: 'p0009' },
                { label: 'Chili BBQ', price: 0, barcode: 'p0010' },
                { label: 'Chili Cheese', price: 0, barcode: 'p0011' },
                { label: 'Golden Sweetcorn', price: 0, barcode: 'p0012' },
                { label: 'White Cheddar', price: 0, barcode: 'p0013' },
                { label: 'Wasabi', price: 0, barcode: 'p0014' },
                { label: 'Truffle', price: 0, barcode: 'p0015' },
            ]
        }
    ]
};
