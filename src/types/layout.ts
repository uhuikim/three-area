export interface Furniture {
  id: string;
  type: 'box' | 'cylinder';
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface RoomDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Layout {
  id: string;
  userId: string;
  name: string;
  timestamp: number;
  roomDimensions: RoomDimensions;
  furnitures: Furniture[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  layoutIds: string[];
}

export interface FurnitureType {
  id: string;
  name: string;
  defaultSize: [number, number, number];
  defaultColor: string;
  type: 'box' | 'cylinder';
}

export interface AppData {
  layouts: Layout[];
  furnitureTypes: FurnitureType[];
  users: User[];
}
