export interface MetricConfig {
    id: string;
    label: string;
    color: string;
    unit: string;
    idealValue?: number;
    yAxisId: 'left' | 'right';
}

export interface MeasurementPoint {
    date: string; // formatted date for axis
    fullDate?: Date; // for tooltip
    [key: string]: any;
}
