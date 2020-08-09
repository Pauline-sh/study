export interface BoundingClientRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ListItemData {
  id: number;
  text: string;
}

export type direction = 'TOP' | 'BOTTOM';