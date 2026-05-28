import { useEffect, useRef, useState } from 'react';

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from 'react-leaflet';

import { type Answer } from '@/Types/types.js';

// Set up OpenLayers to use geographic coordinates (lon/lat)
// useGeographic();

type MapControllerProps = {
  onMapInitialized?: ((map: any) => void) | undefined;
  onMoveStart?: (() => void) | undefined;
  onMoveEnd?: ((center: [number, number]) => void) | undefined;
  onClick?: ((coordinate: [number, number]) => void) | undefined;
}

function MapController({ onMapInitialized, onMoveStart, onMoveEnd, onClick }: MapControllerProps) {
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

type MapComponentProps = {
  initialCoordinates: [number, number];
  initialZoom: number;
  onMapInitialized?: (map: any) => void;
  onMoveStart?: () => void;
  onMoveEnd?: (center: [number, number]) => void;
  onClick?: (coordinate: [number, number]) => void;
  circles?: { center: [number, number]; radius: number }[];
  markers?: Answer[];
}

export default function MapComponent({ initialCoordinates, initialZoom, circles, markers, ...controllerProps }: MapComponentProps) {
  // console.log('initialCoordinates:', initialCoordinates, 'initialZoom:', initialZoom);
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="" />

      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></script>

      <MapContainer
        center={initialCoordinates}
        zoom={initialZoom}
        style={{ width: '100%', height: '500px' }}
        whenReady={() => { }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers?.map(marker => {
            console.log('Rendering marker:', marker);
            return (
                <Marker key={marker.id} position={marker.location} >
                    <Popup>
                        {marker.store_name}
                    </Popup>
                </Marker>
            );
        })}

        <MapController
          {...controllerProps}
        />
      </MapContainer>
    </>
  );
};
