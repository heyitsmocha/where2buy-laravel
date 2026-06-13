import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

import MapController from './MapController';
import type { MapComponentProps } from './map.types';

import MarkerClusterGroup from 'react-leaflet-markercluster';

export default function MapComponent({ initialCoordinates, initialZoom, circles, markers, ...controllerProps }: MapComponentProps) {
  // console.log('initialCoordinates:', initialCoordinates, 'initialZoom:', initialZoom);
  const leafletBaseLink = "https://unpkg.com/leaflet@1.9.4/dist";

  return (
    <>
      <link rel="stylesheet" href={`${leafletBaseLink}/leaflet.css`}
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="" />

      <link
        rel="stylesheet"
        href="https://unpkg.com/react-leaflet-markercluster/styles"
      />

      <script src={`${leafletBaseLink}/leaflet.js`}
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></script>

      <MapContainer
        center={initialCoordinates}
        zoom={initialZoom}
        style={{ width: '100%', height: '500px' }}
        whenReady={() => { }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

        <MarkerClusterGroup>
          {markers?.map(marker => {
            console.log('Rendering marker:', marker);
            return (
              <Marker key={marker.id} position={[marker.latitude, marker.longitude]} >
                <Popup>
                  {marker.store_name}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>

        <MapController
          {...controllerProps}
        />
      </MapContainer>
    </>
  );
};
