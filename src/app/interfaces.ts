// export interface Section {
//     name: string;
//     id: number;
//     expanded: boolean;
// }
export interface Section {
    name: string;
    id: number;
    expanded: boolean;
    sections?: Array<InnerSection>
}
export interface InnerSection {
    id: number;
    parentId: number;
    name: string;
    items: Array<Position>;    
}
export interface Position {
    name: string;
    sale: number
}