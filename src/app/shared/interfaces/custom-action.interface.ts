export interface ICustomAction {
    icon: string;
    tooltip?: string;
    color?: string;
    disabled?: boolean;
    action: (row: any) => void;
}
