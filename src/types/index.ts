export interface LocalizedString {
    ko: string;
    en: string;
    ja: string;
    zh: string;
    [key: string]: string;
}

export interface NavItem {
    id: string; // Translation key
    href: string;
    subitems?: {
        id: string;
        label: string;
        href: string;
    }[];
}

export interface FeaturedItem {
    id: string;
    title: LocalizedString;
    category: string;
    subcategory?: string;
    description: LocalizedString;
    imageUrl: string;
    date: LocalizedString;
    location: LocalizedString;
    price: LocalizedString;
    closedDays?: string[];
    videoUrl?: string;
    user_id?: string;
}

export interface FloorContent {
    type: 'text' | 'image' | 'video';
    value: string | LocalizedString;
    caption?: LocalizedString;
}

export interface FloorCategory {
    id: string;
    floor: string;
    title: LocalizedString;
    description: LocalizedString;
    bgImage: string;
    content?: FloorContent[];
}
