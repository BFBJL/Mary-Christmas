
export enum TreeState {
  CLOSED = 'CLOSED',
  EXPLODED = 'EXPLODED',
  ZOOMED = 'ZOOMED'
}

export interface HandData {
  isOpen: boolean;
  isFist: boolean;
  isPinching: boolean;
  pinchPosition: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

export interface PhotoItem {
  id: string;
  url: string;
  texture: any; // THREE.Texture
}
