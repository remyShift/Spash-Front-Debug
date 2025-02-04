export type Event = 'hits' | 'lobs' | 'services' | 'checks' | 'points' | 'rebonds';

export interface EventTimeline {
    [event: string]: number[];
};

export interface TimelineInterval {
    start: number;
    end: number;
    type: "Point" | "InterPoint";
}