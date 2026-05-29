import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

import MapController from './MapController';
import type { MapComponentProps } from './map.types';

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
