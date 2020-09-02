export interface Section {
    name: string;
    id: number;
    expanded: boolean;
    sections?: Array<SubSection>;
}
export interface SubSection {
    id: number;
    parentId: number;
    name: string;
    expanded: boolean;
    items: Array<Position>;
}
export interface Position {
    id: number;
    sectionId: number;
    name: string;
    sale: number;
}
