import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import type { MapControllerProps } from './map.types';

export default function MapController({ onMapInitialized, onMoveStart, onMoveEnd, onClick }: MapControllerProps) {
  const map = useMap();

  // Notify parent that map exists
  useEffect(() => {
    onMapInitialized?.(map);
  }, [map, onMapInitialized]);

  // Set up event listeners for map interactions
  const callbacksRef = useRef({ onMoveStart, onMoveEnd, onClick });
  // Listen for changes in callbacks to prevent stale closures
  useEffect(() => {
    callbacksRef.current = { onMoveStart, onMoveEnd, onClick };
  }, [onMoveStart, onMoveEnd, onClick]);
  // Set up event listeners for map interactions
  useEffect(() => {
    const handleMoveStart = () => {
      callbacksRef.current.onMoveStart?.();
    };
    map.on('movestart', handleMoveStart);

    const handleMoveEnd = () => {
      const center = map.getCenter();
      if (center) {
        callbacksRef.current.onMoveEnd?.([center.lat, center.lng]);
      }
    }
    map.on('moveend', handleMoveEnd);


    const handleClick = (event: any) => {
      callbacksRef.current.onClick?.([event.latlng.lat, event.latlng.lng]);
    };
    map.on('click', handleClick);

    // Cleanup function to unbind event listeners when component unmounts or dependencies change
    return () => {
      map.off('movestart', handleMoveStart);
      map.off('moveend', handleMoveEnd);
      map.off('click', handleClick);
    }
  }, [map]);

  return null;
}
