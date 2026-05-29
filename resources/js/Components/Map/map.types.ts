import { type Answer } from '@/Types/types.js';

export interface MapControllerProps {
  onMapInitialized?: ((map: any) => void) | undefined;
  onMoveStart?: (() => void) | undefined;
  onMoveEnd?: ((center: [number, number]) => void) | undefined;
  onClick?: ((coordinate: [number, number]) => void) | undefined;
}

export interface MapComponentProps extends MapControllerProps {
  initialCoordinates: [number, number];
  initialZoom: number;
  circles?: { center: [number, number]; radius: number }[];
  markers?: Answer[];
}
