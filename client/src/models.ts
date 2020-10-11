export interface Gauge {
    key: string;
    value: string;
}

export interface Display {
    key: string;
    available: boolean;
    resolution_x: number;
    resolution_y: number;
    display_data: string;
    rotation: number;
}

export interface Layout {
    key: string;
    data: any;
    display_positions: string;
}
