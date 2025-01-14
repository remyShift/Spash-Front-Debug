export type Event = 'hits' | 'lobs' | 'services' | 'checks' | 'points' | 'rebonds';

export interface EventTimeline {
    [event: string]: number[];
};

export interface TimelineInterval {
    [event: string]: {
        start: number;
        end: number;
        type: string;
    };
};