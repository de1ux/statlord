export interface Gauge {
    key: string;
    value: string;
}

export interface Display {
    key: string;
    available: boolean;
    resolution_x: number;
    resolution_y: number;
}

export interface Layout {
    data: any
}