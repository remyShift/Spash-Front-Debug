export type Event = 'hits' | 'lobs' | 'services' | 'checks' | 'points' | 'rebonds';

export interface EventTimeline {
    [event: string]: number[];
};