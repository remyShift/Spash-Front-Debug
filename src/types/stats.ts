export interface Badge {
    badge_type: string;
    value: number;
    top_badge: boolean;
}

export interface PlayerStats {
    name: string;
    video_path: string;
    badges: Badge[];
    [key: string]: {
        score: number;
        [subcategory: string]: {
            score: number;
        } | number;
    } | string | Badge[] | number;
}

export interface Category {
    name: string;
    key: string;
    rowCount: number;
    type?: 'badges' | 'text' | 'media';
    subcategories?: string[];
}

export interface SubcategoryData {
    score: number;
    [key: string]: {
        score: number;
    } | number;
}