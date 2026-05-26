import { useEffect, useRef, useState } from 'react';

import { MdLocationPin } from 'react-icons/md';
import { renderToStaticMarkup } from 'react-dom/server';

import { Map as LeafletMap } from 'leaflet';

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
} from 'react-leaflet'

// Set up OpenLayers to use geographic coordinates (lon/lat)
// useGeographic();

type MapControllerProps = {
  onMapInitialized?: (map: any) => void;
  onMoveStart?: () => void;
  onMoveEnd?: (center: [number, number]) => void;
  onClick?: (coordinate: [number, number]) => void;
}

function MapController({ onMapInitialized, onMoveStart, onMoveEnd, onClick }: MapControllerProps) {
  const map = useMap();

  // Notify parent that map exists
  useEffect(() => {
    onMapInitialized?.(map);
  }, [map, onMapInitialized]);

  // Set up event listeners for map interactions
  useEffect(() => {
    map.on('movestart', () => {
      onMoveStart?.();
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      if (center) {
        onMoveEnd?.([center.lat, center.lng]);
      }
    });

    map.on('click', (event) => {
      onClick?.([event.latlng.lat, event.latlng.lng]);
    });

    // Cleanup function to unbind event listeners when component unmounts or dependencies change
    return () => {
      map.off('movestart');
      map.off('moveend');
      map.off('click');
    }
  }, [map, onMoveStart, onMoveEnd, onClick]); // Listen for changes in callbacks to prevent stale closures and re-bind events

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
  markers?: { id: number; coordinate: [number, number] }[];
}

export default function MapComponent({ initialCoordinates, initialZoom, onMapInitialized, onMoveStart, onMoveEnd, onClick, circles, markers }: MapComponentProps) {
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
                <Marker key={marker.id} position={marker.coordinate} />
            );
        })}

        <MapController
          {...(onMapInitialized ? { onMapInitialized } : {})}
          {...(onMoveStart ? { onMoveStart } : {})}
          {...(onMoveEnd ? { onMoveEnd } : {})}
          {...(onClick ? { onClick } : {})}
        />
      </MapContainer>
    </>
  );
};
